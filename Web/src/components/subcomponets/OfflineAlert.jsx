import { Alert, AlertTitle, Box, Collapse, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const oneMin = 60000;

export const OfflineAlert = ({ show, at, displayAt }) => {
	const [showRelativeTime, setShowRelativeTime] = useState(true);
	const [relativeDisplayTime, setRelativeDisplayTime] = useState(null);

	useEffect(() => {
		const interval = setInterval(() => {
			setRelativeDisplayTime(parseRelativeDateTime(at));
		}, oneMin);

		return () => clearInterval(interval);
	}, [at]);

	useEffect(() => {
		if (show) {
			setRelativeDisplayTime(parseRelativeDateTime(at));
		}
	}, [show, at]);

	return (
		<Box sx={{ width: "100%" }}>
			<Collapse in={show}>
				<Alert
					severity="error"
					variant="filled"
					onClick={() => {
						setShowRelativeTime(!showRelativeTime);
					}}
				>
					<AlertTitle>Offline</AlertTitle>
					The app has been offline since{" "}
					<Tooltip title={showRelativeTime ? displayAt : relativeDisplayTime}>{showRelativeTime ? relativeDisplayTime : displayAt}</Tooltip>
					. Please check your internet connection.
				</Alert>
			</Collapse>
		</Box>
	);
};
/**
 * Parses a dayjs relative time string from a JSON date string
 * @param {string} at
 * @returns
 */
function parseRelativeDateTime(at) {
	dayjs.extend(relativeTime);
	const date = new Date(JSON.parse(at));
	return dayjs(date).fromNow();
}