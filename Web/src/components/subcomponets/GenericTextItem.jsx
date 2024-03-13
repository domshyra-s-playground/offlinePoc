import { Controller, useForm } from "react-hook-form";
import { Grid, InputAdornment, Skeleton, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import ControlItemDescription from "./ControlItemDescription";
import PropTypes from "prop-types";
import { isSafeNumberValue } from "../../tools/numbers";
import { useTheme } from "@mui/material/styles";

//These are meant to be used everywhere, can work in forms if customControl and name is provided, can work in autoSaves if OnBlur is provided

//USE IN FORMS YOU MUST PROVIDE CUSTOMCONTROL AND NAME

//TO USE IN AUTOSAVE YOU MUST PROVIDE ONBLUR AND ONCHANGE TO MANAGE YOUR STATE

/**
 * Used for all text items
 * @remarks this is the base for all numeric item/fields
 * @remarks This can be used as a FORM ITEM if you supply a customControl
 * @param {*} props
 * @param {string} label is used on the text field
 * @param {string} description is used adjacent to the text field
 * @returns
 */

const GenericTextItem = ({
	label = null,
	id,
	onTextFieldChange = () => {},
	textFieldValue,
	onTextFieldBlur = () => {},
	onParentTextFieldBlur = () => {},
	onParentTextFieldChange = () => {},
	isInvalid = () => {
		return false;
	},
	pattern,
	rules,
	disabled = false,
	customErrorMessage = "",
	endAdornment = "",
	textAlign = "left",
	description = "",
	descriptionFontWeight = "",
	customControl = null,
	customSetValue = null,
	justifyContent = "flex-end",
	totalTooltip = "",
	setFocused = () => {},
	setHover = () => {},
	name = "",
	maxWidth = 75,
	isNumberOnly = false,
	fullWidth = false,
	isLoading = false,
	multiline = false,
}) => {
	const theme = useTheme();
	//Create a new form for each item, unless a custom control is provided
	const { control, setValue } = useForm({
		mode: "onChange",
	});

	const fieldName = name ? name : `${id}_field`;

	//used if we are rending the description in this component and not via GradingItem
	const [localFocused, setLocalFocused] = useState(false);
	const [localHover, setLocalHover] = useState(false);

	useEffect(() => {
		if (customSetValue) {
			customSetValue(fieldName, textFieldValue, { shouldTouch: true, shouldDirty: true });
		} else {
			setValue(fieldName, textFieldValue, { shouldTouch: true, shouldValidate: true, shouldDirty: true });
		}
	}, [customSetValue, fieldName, setValue, textFieldValue]);

	let inputProps = {
		style: { textAlign: textAlign },
	};

	if (!isNumberOnly) {
		//Add max length to prevent overflow
		inputProps.maxLength = 2000;
	}

	const isRequired = () => {
		if (rules) {
			//React hook forms sometimes has a string in the required object to denote the error message and if something is required.
			//rules.required will not always be a boolean type here. Converting manually.
			return !!rules.required;
		} else {
			return false;
		}
	};

	//can customize more later but lets text be full width if we use min instead of max
	let textFieldStyle = isNumberOnly ? { maxWidth: maxWidth } : { minWidth: maxWidth };

	if (isLoading) {
		return <Skeleton width={50} />;
	}

	return (
		<Controller
			rules={rules}
			control={customControl ? customControl : control}
			name={fieldName}
			defaultValue={textFieldValue ?? ""}
			render={({ field: { onChange, onBlur, ref, value }, fieldState: { error } }) => (
				<>
					<Grid
						container
						direction="row"
						justifyContent={justifyContent}
						alignContent="center"
						alignItems="center"
						style={{ background: "#f5f5f5" }}
					>
						<Grid item>
							<ControlItemDescription
								description={description}
								descriptionFontWeight={descriptionFontWeight}
								totalTooltip={totalTooltip}
								localFocused={localFocused}
								localHover={localHover}
							/>
						</Grid>
						<Grid item>
							<TextField
								label={label}
								id={id}
								required={isRequired()}
								name={name ? name : id}
								fullWidth={fullWidth}
								variant="standard"
								color="primary"
								value={value}
								inputRef={ref}
								multiline={multiline}
								error={error !== undefined || isInvalid(error)}
								InputProps={{
									endAdornment: <InputAdornment position="end">{endAdornment}</InputAdornment>,
									inputMode: isNumberOnly ? "numeric" : "text",
									pattern: pattern,
									inputProps: inputProps,
								}}
								style={textFieldStyle}
								disabled={disabled}
								onChange={(e) => {
									if (isNumberOnly) {
										//Only save safe values. This still works with decimals because the regex
										if (isSafeNumberValue(e.target.value) || e.target.value === ".") {
											onChange(e);
											onTextFieldChange(e);
											onParentTextFieldChange(e.target.id, e.target.value);
										}
									} else {
										onChange(e);
										onTextFieldChange(e);
										onParentTextFieldChange(e.target.id, e.target.value);
									}
								}}
								onBlur={(e) => {
									setLocalFocused(false);
									setFocused(false);
									onBlur(e);
									onTextFieldBlur(e);
									if (!error) {
										// only trigger the auto-save ability if no error
										onParentTextFieldBlur(e.target.id, e.target.value);
									}
								}}
								onFocus={() => {
									setLocalFocused(true);
									setFocused(true);
								}}
								onMouseOver={() => {
									setLocalHover(true);
									setHover(true);
								}}
								onMouseOut={() => {
									setLocalHover(false);
									setHover(false);
								}}
							/>
						</Grid>
					</Grid>
					<Grid container direction="row" justifyContent="flex-end">
						{error?.message ? (
							<Typography variant="caption" sx={{ color: theme.palette.error.main }} textAlign="right" pr={1}>
								{error?.message}
							</Typography>
						) : null}
						{isInvalid(error) ? (
							<Typography variant="caption" sx={{ color: theme.palette.error.main }} textAlign="right">
								{customErrorMessage}
							</Typography>
						) : null}
					</Grid>
				</>
			)}
		/>
	);
};

GenericTextItem.propTypes = {
	id: PropTypes.string,
	onTextFieldChange: PropTypes.func,
	textFieldValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onTextFieldBlur: PropTypes.func,
	isInvalid: PropTypes.func,
	rules: PropTypes.object,
	disabled: PropTypes.bool,
	customErrorMessage: PropTypes.string,
	label: PropTypes.string,
	endAdornment: PropTypes.string,
	textAlign: PropTypes.string,
	descriptionFontWeight: PropTypes.string,
};

export default GenericTextItem;
