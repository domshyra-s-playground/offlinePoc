import { Alert, Link, Snackbar, Typography } from "@mui/material";
import React, { useCallback } from "react";

import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setToast } from "../../redux/slices/toast";

const ToastAlert = ({ show, isError, displaySeverity = "success", message, link, setToast }) => {
	const onClose = useCallback(() => {
		setToast(false, "", "");
	}, [setToast]);

	return (
		<Snackbar open={show} autoHideDuration={10000} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
			<Alert id="alert-delete-msg" onClose={onClose} severity={isError ? "error" : displaySeverity} sx={{ width: "100%" }}>
				{link?.length > 0 ? (
					<Link underline="none" component={NavLink} to={link} reloadDocument>
						<Typography sx={{ fontWeight: "bold" }} display="inline">
							{message}
						</Typography>
					</Link>
				) : (
					<Typography variant={"body1"}>{message}</Typography>
				)}
			</Alert>
		</Snackbar>
	);
};

function mapStateToProps(state) {
	return {
		show: state.toast.show,
		message: state.toast.message,
		link: state.toast.link,
		isError: state.toast.isError,
	};
}

const mapDispatchToProps = {
	setToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(ToastAlert);

ToastAlert.propTypes = {
	show: PropTypes.bool,
	isError: PropTypes.bool,
	displaySeverity: PropTypes.string,
	message: PropTypes.string,
	link: PropTypes.string,
	setToast: PropTypes.func.isRequired,
};
