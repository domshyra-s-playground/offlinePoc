import Container from "@mui/material/Container";
import React from "react";
import ToastAlert from "../components/subcomponets/ToastAlert";

export const Layout = (props) => {
	return (
		<>
			<Container>{props.children}</Container>
			<ToastAlert show={false}></ToastAlert>
		</>
	);
};
