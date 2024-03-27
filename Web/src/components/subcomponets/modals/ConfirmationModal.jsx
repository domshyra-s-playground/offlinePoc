import PropTypes from "prop-types";
import React from "react";
import StyledModal from "./StyledModal";

/**
 * Yes or no confirmation modal. ModalBody will be rendered for the body
 * @param {*} param0
 * @returns
 */

const ConfirmationModal = ({ ModalBody, ModalTitle = null, ...props }) => {
	return <StyledModal {...props} prompt="Confirm" ModalBody={ModalBody} ModalTitle={ModalTitle} />;
};

export default ConfirmationModal;

ConfirmationModal.propTypes = {
	ModalBody: PropTypes.element.isRequired,
};
