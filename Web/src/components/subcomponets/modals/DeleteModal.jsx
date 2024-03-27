import { Alert, AlertTitle, Typography } from "@mui/material";
import React, { useMemo } from "react";

import PropTypes from "prop-types";
import StyledModal from "./StyledModal";

/**
 * Delete modal
 * @param {*} param0
 * @returns
 */

const DeleteModal = ({ singleton, ...props }) => {
	const modalTitle = useMemo(() => {
		return (
			<Alert severity="error" variant="outlined">
				<AlertTitle>Warning!</AlertTitle>
			</Alert>
		);
	}, []);
	const modalBody = useMemo(() => {
		return (
			<>
				<Typography align="center" id="are-you-sure-text">
					Are you sure you want to <strong>delete</strong> this <strong>{singleton}</strong>?
				</Typography>
				<Typography align="center" fontWeight={"bold"} pt={1}>
					All data will be lost
				</Typography>
			</>
		);
	}, [singleton]);

	return <StyledModal {...props} prompt="Delete" actionColor="error" ModalBody={modalBody} ModalTitle={modalTitle} />;
};

export default DeleteModal;

DeleteModal.propTypes = {
	singleton: PropTypes.string.isRequired,
};
