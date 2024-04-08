import { Alert, AlertTitle, Box, Collapse, Tooltip } from "@mui/material";

import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export const OfflineAlert = ({ show, at, displayAt }) => {
	dayjs.extend(relativeTime);
	return (
		<Box sx={{ width: "100%" }}>
			<Collapse in={show}>
				<Alert severity="error" variant="filled">
					<AlertTitle>Offline</AlertTitle>
					The app has been offline since <Tooltip title={displayAt}>{dayjs(new Date(JSON.parse(at))).fromNow()}</Tooltip>. Please check your
					internet connection.
				</Alert>
			</Collapse>
		</Box>
	);
};
