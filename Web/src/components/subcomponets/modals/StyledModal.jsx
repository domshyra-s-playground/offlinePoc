import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import React, { Fragment, useCallback, useMemo, useState } from "react";

import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";

//TODO! still some issue where the modal does reopen after being closed. It seems to be calling the parent component but not reopening the modal

/**
 * base modal component
 * @param {*} param0
 * @returns
 */

const StyledModal = ({
	show,
	setShow,
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
		setOpen(false);
		handleClose();
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
