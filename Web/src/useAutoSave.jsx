import * as jsonpatch from "fast-json-patch";

import { useCallback, useEffect, useState } from "react";

import { isProdEnv } from "./config";
import { useBeforeUnload } from "react-router-dom";

//3 seconds for local/dev, 60 seconds for prod
const autoSaveInterval = isProdEnv() ? 60000 : 5000;

//!Note, if you have a rkqMutation that is a changing your object make sure you are also not using a useEffect to update the object via rhf.setValue

/**
 * Used to auto save a record every 60 seconds once methods.formState.isDirty is true and will use the rtkQueryMutation to save the record
 * @remarks Every value in the form needs registered with the useForm hook. In other words methods.getValues should return every value
 * needing to be saved in the backend.
 * @param {object} defaultValues methods.formState.defaultValues
 * @param {bool} isDirty methods.formState.isDirty
 * @param {func} getValues methods.getValues
 * @param {func} resetField methods.resetField
 * @param {string} id id of the record to being patched
 * @param {*} recordName record name to be used in the toast message
 * @param {*} rtkQueryMutation patch mutation to be used to save the record
 * @param {*} setToast redux action to set the toast
 * @param {bool} offline should we try to save the record
 * @remarks This doesn't work with rhf objects, there is a bug with rhf.
 */
export default function useAutoSave(defaultValues, isDirty, getValues, resetField, id, recordName, rtkQueryMutation, setToast, offline) {
	const [autoSave, setAutoSave] = useState(null);
	const [savedAt, setSavedAt] = useState(null);

	const handleSave = useCallback((savedTime) => {
		setSavedAt(savedTime);
	}, []);

	// if the form gets dirty start saving every 60 seconds
	useEffect(() => {
		if (isDirty) {
			const intervalForAutoSave = setInterval(function () {
				setAutoSave(true);
			}, autoSaveInterval);
			return async () => {
				//If component is unmounted and isDirty, save the record
				//Note: this also gets after we trigger the autoSave useEffect below as well as unmount/back button
				const formIsStillDirty = await autoSaveRecord(
					defaultValues,
					getValues,
					resetField,
					rtkQueryMutation,
					id,
					recordName,
					setToast,
					handleSave
				);
				if (formIsStillDirty !== true) {
					setAutoSave(false); // turn autosave off
					clearInterval(intervalForAutoSave); // clear autosave on dismount
				}
			};
		}
	}, [defaultValues, getValues, id, isDirty, recordName, resetField, rtkQueryMutation, setToast, handleSave]);

	useEffect(() => {
		async function autoSaveData() {
			if (autoSave) {
				const formIsStillDirty = await autoSaveRecord(
					defaultValues,
					getValues,
					resetField,
					rtkQueryMutation,
					id,
					recordName,
					setToast,
					handleSave
				);
				if (formIsStillDirty !== true) {
					setAutoSave(false); // turn autosave off
				}
			}
		}
		if (!offline) {
			autoSaveData();
		}
	}, [autoSave, id, defaultValues, getValues, resetField, recordName, rtkQueryMutation, setToast, offline, handleSave]);

	//On page refresh send data to the back end
	useBeforeUnload(
		useCallback(async () => {
			await autoSaveRecord(defaultValues, getValues, resetField, rtkQueryMutation, id, recordName, setToast, handleSave);
		}, [id, defaultValues, getValues, resetField, recordName, rtkQueryMutation, setToast, handleSave])
	);

	return { savedAt };
}

/**
 * Auto saves the record using the rtkQueryMutation
 * @param {*} methods
 * @param {*} rtkQueryMutation
 * @param {*} id
 * @param {*} recordName
 * @param {*} setToast
 * @returns
 */
async function autoSaveRecord(defaultValues, getValues, resetField, rtkQueryMutation, id, recordName, setToast, setSavedAt) {
	const beforeSaveValues = defaultValues;
	const valuesToSave = getValues();
	const operations = jsonpatch.compare(beforeSaveValues, valuesToSave);
	if (operations.length === 0) {
		return;
	}
	rtkQueryMutation({ id: id, operations }).then((response) => {
		if (response.data) {
			//Looks at each dirtyFields, touchedFields and defaultValues and resets to new values
			console.log("saved these fields", operations);
			const valuesAfterSave = getValues();
			const formIsStillDirty = resetUpdatedFields(valuesToSave, valuesAfterSave, resetField, operations);
			var saveTime = new Date();
			setToast({ show: true, message: `${recordName} saved at ${saveTime.toLocaleTimeString()}` });
			setSavedAt(saveTime);
			return formIsStillDirty;
		} else {
			setToast({ show: true, message: "There was an error saving. Please try again later.", isError: true });
		}
	});
}
//TODO! there is a bug where song rows will get deleted if in progress and we save
/**
 * Checks the fields that were saved, keep dirty if any changes happened after the save, otherwise reset the field
 * @param {*} valuesToSave
 * @param {*} getValues
 * @param {*} resetField
 * @param {Array} operations
 * @returns
 */
function resetUpdatedFields(valuesToSave, valuesAfterSave, resetField, operations) {
	//if the field is different than when we save, keep that one dirty so we don't loose data, notes for example
	const inProgressOperations = jsonpatch.compare(valuesToSave, valuesAfterSave);
	const inProgressFields = inProgressOperations.map((operation) => {
		return getFieldNameFromOperation(operation);
	});

	const formIsStillDirty = inProgressFields?.length > 0;
	const possibleFieldsToRest = operations
		.map((operation) => {
			if (inProgressFields?.length === 0 || !inProgressFields?.includes(operation.path.substring(1))) {
				return getFieldNameFromOperation(operation);
			}
			return null;
		})
		.filter((field) => field !== null);

	const uniqueFieldsToRest = [...new Set(possibleFieldsToRest)];
	uniqueFieldsToRest?.forEach((field) => {
		const defaultValue = valuesToSave[field];
		resetField(field, { defaultValue: defaultValue, keepDirty: false });
	});

	return formIsStillDirty;
}

/**
 * Returns the field name from the operation and removes the / from the beginning of the path
 * if it is a nested field, it will return the parent field name
 * @param {*} operation
 * @returns
 */
function getFieldNameFromOperation(operation) {
	const path = operation.path.substring(1);
	if (path.includes("/")) {
		return path.substring(0, path.indexOf("/"));
	}
	return path;
}

/**
 * Returns the operations needed to update the object with the updatedId and updatedValue
 * @param {*} object
 * @param {*} updatedId
 * @param {*} updatedValue
 * @returns
 */
export function getOperationsFromObject(object, updatedId, updatedValue) {
	//This syntax says if we have a prop of updatedId, then use that as the key,
	//otherwise use an empty object so we call add instead of replace in the backend
	const oldObj = object[updatedId] ? { [updatedId]: object[updatedId] } : {};
	const newObj = { [updatedId]: updatedValue ?? "" };
	const operations = jsonpatch.compare(oldObj, newObj);
	return operations;
}
