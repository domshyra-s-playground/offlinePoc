import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import React, { Fragment, useCallback, useMemo, useState } from "react";

import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";

/**
 * base modal component
 * @remarks when using this component you must pass in the action to be performed when the action button is clicked
 * @remarks when using this component remember to give it a key to force a re-render, this is because the modal will not re-render when the show prop is toggled
 * for example <StyledModal key={show ? "someId" : ""} ... />
 * @param {*} param0
 * @returns
 */

const StyledModal = ({
	show,
	action,
	prompt = "Action",
	actionColor = "primary",
	handleClose,
	closeButtonText = "Close",
	ModalBody = <Fragment />,
	ModalTitle = <Fragment />,
	...props
}) => {
	const [open, setOpen] = useState(show);
	const [loading, setLoading] = useState(false);
	const actionOnClick = useCallback(async () => {
		setLoading(true);
		await action();
		setLoading(false);
		setOpen(false);
	}, [action]);

	const actionButton = useMemo(() => {
		return (
			<LoadingButton
				type="submit"
				loading={loading}
				id="modal-action-btn"
				color={actionColor}
				align="right"
				variant="contained"
				onClick={actionOnClick}
			>
				{prompt}
			</LoadingButton>
		);
	}, [actionColor, actionOnClick, loading, prompt]);

	const close = () => {
		handleClose();
		setOpen(false);
	};

	return (
		<Dialog open={open} onClose={close} fullWidth={true} {...props}>
			<DialogTitle>{ModalTitle}</DialogTitle>
			<DialogContent>{ModalBody}</DialogContent>
			<DialogActions>
				<Grid container justifyContent={"flex-start"}>
					{actionButton}
				</Grid>
				<Grid container justifyContent={"flex-end"}>
					<Button id="modal-close-btn" onClick={close} color={"primary"}>
						{closeButtonText}
					</Button>
				</Grid>
			</DialogActions>
		</Dialog>
	);
};

export default StyledModal;

StyledModal.propTypes = {
	show: PropTypes.bool,
	action: PropTypes.func.isRequired,
	prompt: PropTypes.string,
	handleClose: PropTypes.func.isRequired,
	closeButtonText: PropTypes.string,
	ModalBody: PropTypes.object,
	ModalTitle: PropTypes.object,
};
