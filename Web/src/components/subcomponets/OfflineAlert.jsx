import { Alert, AlertTitle, Box, Collapse } from "@mui/material";

import React from "react";

export const OfflineAlert = ({ show }) => {
	return (
		<Box sx={{ width: "100%" }}>
			<Collapse in={show}>
				<Alert severity="error" variant="filled">
					<AlertTitle>Offline</AlertTitle>
					The app is currently offline. Please check your internet connection.
				</Alert>
			</Collapse>
		</Box>
	);
};
