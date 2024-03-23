import { Button, Dialog, DialogActions, DialogContent, Grid } from "@mui/material";
import React, { useState } from "react";

import { LoadingButton } from "@mui/lab";
import PropTypes from "prop-types";
import { useEffect } from "react";

/**
 * Yes or no confirmation modal. ModalBody will be rendered for the body
 * @param {*} param0
 * @returns
 */

const ConfirmationModal = ({
	confirmAction,
	confirmPrompt = "Confirm",
	showModal = false,
	ModalBody,
	maxWidth = "sm",
	confirmationButtonColor = "primary",
	handleClose = () => {},
	closeButtonText = "Close",
	disableConfirmationButton = false,
}) => {
	const [show, setShow] = useState(showModal);
	const [errorOnAction, setErrorOnAction] = useState(false);
	const [loading, setLoading] = useState(false);
	const confirm = () => {
		setLoading(true);
		confirmAction()
			.then(() => {
				setErrorOnAction(false);
			})
			.catch(() => {
				setErrorOnAction(true);
			})
			.finally(() => {
				setLoading(false);
				setShow(false);
			});
	};

	useEffect(() => {
		//if modal gets closed by parent, lets no longer show loading so the modal won't be locked from a second save
		if (show === false) {
			setLoading(false);
		}
	}, [show]);

	const confirmButton = () => {
		return (
			<LoadingButton
				type="submit"
				loading={loading}
				id="modal-confirm-btn"
				color={confirmationButtonColor}
				align="right"
				variant="text"
				onClick={confirm}
				disabled={disableConfirmationButton}
			>
				{confirmPrompt}
			</LoadingButton>
		);
	};

	return (
		<Dialog
			open={show}
			onClose={() => {
				handleClose();
			}}
			fullWidth={true}
			maxWidth={maxWidth}
		>
			<DialogContent>
				<ModalBody />
			</DialogContent>
			<DialogActions>
				<Grid container justifyContent={"flex-start"}>
					{confirmButton()}
				</Grid>
				<Grid container justifyContent={"flex-end"}>
					<Button id="modal-close-btn" onClick={() => setShow(false)} color={"secondary"}>
						{closeButtonText}
					</Button>
				</Grid>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmationModal;

ConfirmationModal.propTypes = {
	confirmAction: PropTypes.func,
	confirmPrompt: PropTypes.string,
	ModalBody: PropTypes.elementType,
};
