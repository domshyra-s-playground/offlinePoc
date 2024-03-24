import { Grid } from "@mui/material";
import React from "react";
import ToastAlert from "../components/subcomponets/ToastAlert";

export const ToastLayout = (props) => {
	return (
		<>
			<Grid container>{props.children}</Grid>
			<ToastAlert show={false}></ToastAlert>
		</>
	);
};
