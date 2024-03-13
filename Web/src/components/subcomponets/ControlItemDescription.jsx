import PropTypes from "prop-types";
import React from "react";
import { Typography } from "@mui/material";

/**
 * Used to render a label adjacent to our item component, otherwise we will use GradingItem to render the description
 * @param {*} param0
 * @returns
 */
export default function ControlItemDescription({ description = "", descriptionFontWeight = "", localFocused = false, localHover = false }) {
	return (
		<>
			{/* Render description adjacent if we provide a description prop */}
			{description ? (
				<Typography
					variant="subtitle1"
					pr={2}
					fontWeight={descriptionFontWeight ? descriptionFontWeight : localHover || localFocused ? "bold" : null}
					align="inherit"
					color={localFocused ? "primary" : null}
				>
					{description}
				</Typography>
			) : null}
		</>
	);
}

ControlItemDescription.propTypes = {
	description: PropTypes.string,
	descriptionFontWeight: PropTypes.string,
	totalTooltip: PropTypes.string,
	localFocused: PropTypes.bool,
};
