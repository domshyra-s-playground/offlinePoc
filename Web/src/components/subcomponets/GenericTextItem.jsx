import { Controller, useForm } from "react-hook-form";
import { InputAdornment, Skeleton, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";

import PropTypes from "prop-types";
import { isSafeNumberValue } from "../../tools/numbers";
import { useTheme } from "@mui/material/styles";

/**
 * Used for all text items
 * can work in forms if customControl and name is provided
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
	isInvalid = () => {
		return false;
	},
	pattern,
	rules,
	disabled = false,
	customErrorMessage = "",
	endAdornment = "",
	textAlign = "left",
	customControl = null,
	customSetValue = null,
	setFocused = () => {},
	setHover = () => {},
	name = "",
	maxWidth = 75,
	isNumberOnly = false,
	isLoading = false,
	...props
}) => {
	const theme = useTheme();
	//Create a new form for each item, unless a custom control is provided
	const { control, setValue } = useForm({
		mode: "onChange",
	});

	const fieldName = name ? name : `${id}_field`;

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
					<Stack spacing={1} justifyContent="center">
						<TextField
							{...props}
							value={value}
							label={label}
							id={id}
							required={isRequired()}
							name={name ? name : id}
							variant="standard"
							color="primary"
							inputRef={ref}
							error={error !== undefined || isInvalid(error)}
							InputProps={{
								endAdornment: <InputAdornment position="end">{endAdornment}</InputAdornment>,
								inputMode: isNumberOnly ? "numeric" : "text",
								pattern: pattern,
								inputProps: inputProps,
							}}
							style={textFieldStyle}
							onChange={(e) => {
								if (isNumberOnly) {
									//Only save safe values. This still works with decimals because the regex
									if (isSafeNumberValue(e.target.value) || e.target.value === ".") {
										onChange(e);
										onTextFieldChange(e);
									}
								} else {
									onChange(e);
									onTextFieldChange(e);
								}
							}}
							onBlur={(e) => {
								setFocused(false);
								onBlur(e);
								onTextFieldBlur(e);
							}}
							onFocus={() => {
								setFocused(true);
							}}
							onMouseOver={() => {
								setHover(true);
							}}
							onMouseOut={() => {
								setHover(false);
							}}
						/>
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
					</Stack>
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
