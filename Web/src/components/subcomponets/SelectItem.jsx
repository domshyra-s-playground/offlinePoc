import { FormControl, Grid, InputLabel, MenuItem, Select, Skeleton } from "@mui/material";

import { Controller } from "react-hook-form";
import FormHelperText from "@mui/material/FormHelperText";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTheme } from "@mui/material/styles";

/**
 * The select item component that the data is written into React Hook Forms for patch saves
 * @param {*} param0
 * @returns
 */
const SelectItem = ({
	id,
	label,
	options,
	showLabel = false,
	rules = {},
	setFocused = () => {},
	setHover = () => {},
	disabled = false,
	isLoading = false,
}) => {
	const theme = useTheme();
	const methods = useFormContext();

	const defaultValue = methods.getValues(id);

	const isRequired = () => {
		if (rules) {
			//React hook forms sometimes has a string in the required object to denote the error message and if something is required.
			//rules.required will not always be a boolean type here. Converting manually.
			return !!rules.required;
		}
	};

	if (isLoading) {
		return <Skeleton width={50} />;
	}

	return (
		<Grid container justifyContent="flex-end" alignContent="center" alignItems="center">
			<Controller
				control={methods.control}
				name={id}
				defaultValue={defaultValue ?? null}
				render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
					<Grid item xs={12}>
						<FormControl size="small" variant="standard" sx={{ minWidth: 170 }} required={isRequired()}>
							{showLabel ? <InputLabel id={`${id}-label`}>{label}</InputLabel> : null}
							<Select
								id={id}
								value={value ?? ""}
								label={label}
								onChange={(event) => {
									onChange(event);
								}}
								onOpen={() => {
									setFocused(true);
								}}
								onClose={() => {
									setFocused(false);
								}}
								onMouseOver={() => {
									setHover(true);
								}}
								onMouseOut={() => {
									setHover(false);
								}}
								error={error !== undefined}
								disabled={disabled}
								inputRef={ref}
							>
								<MenuItem value={null}>Select an item</MenuItem>
								{options.map((option) => (
									<MenuItem value={option} key={option}>
										{option}
									</MenuItem>
								))}
							</Select>
							<FormHelperText sx={{ color: theme.palette.error.main, textAlign: "right" }}>{error?.message}</FormHelperText>
						</FormControl>
					</Grid>
				)}
				rules={rules}
			/>
		</Grid>
	);
};

export default SelectItem;

SelectItem.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	description: PropTypes.string,
	options: PropTypes.array,
	disabled: PropTypes.bool,
};
