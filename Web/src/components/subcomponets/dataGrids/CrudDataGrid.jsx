import { Box, Button, Container, Grid, Link, Typography } from "@mui/material";
import React, { useCallback, useRef, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "../modals/DeleteModal";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import StripedDataGrid from "./StripedDataGrid";
import { connect } from "react-redux";
import { setToast } from "../../../redux/slices/toast";

/**
 * Crud Data Grid component
 * create, read, update, delete data grid component. Delete has a modal confirmation.
 * @param {*} props
 * @returns
 */
const CrudDataGrid = (props) => {
	const ref = useRef(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedRecordId, setSelectedRecordId] = useState(null);

	const handleOpenDeleteModal = useCallback(() => {
		setShowDeleteModal(true);
	}, []);
	const handleCloseDeleteModal = useCallback(() => {
		setShowDeleteModal(false);
	}, []);

	const { singleton, title, createPath, deleteAction, setToast } = props;
	const createLabel = `Create ${singleton}`;

	/**
	 * Defines all the available action buttons for the data grid and places them in a single column.
	 * @type {{disableColumnMenu: boolean, filterable: boolean, headerName: string, field: string, flex: number, sortable: boolean, align: string, renderCell: (function(*): *)}}
	 */
	const actionButtonsColumnDefinition = {
		field: "actionButtons",
		headerName: "",
		filterable: false,
		sortable: false,
		disableColumnMenu: true,
		flex: 2,
		align: "right",
		renderCell: (cellValues) => {
			return (
				<DeleteActionButton
					cellValues={cellValues}
					setSelectedRecordId={setSelectedRecordId}
					handleOpenDeleteModal={handleOpenDeleteModal}
					singleton={singleton}
				/>
			);
		},
	};

	/**
	 * Defines the delete modal for the data grid.
	 * this expects and rtkquery mutation to be passed in as a deleteAction prop.
	 */
	const deleteRecord = useCallback(async () => {
		await deleteAction(selectedRecordId)
			.unwrap()
			.then(() => {
				setToast({ show: true, message: `${singleton} deleted.` });
			})
			.catch(() => {
				setToast({ show: true, message: `Error deleting ${singleton}.` });
			});
	}, [deleteAction, selectedRecordId, setToast, singleton]);

	return (
		<Container>
			<Box mb={2} pb={2}>
				<Header createLabel={createLabel} createPath={createPath} singleton={singleton} title={title} />
				<StripedDataGrid {...props} columns={[...props.columns, actionButtonsColumnDefinition]} ref={ref} />
				<DeleteModal
					key={showDeleteModal ? selectedRecordId : ""}
					singleton={singleton}
					action={deleteRecord}
					show={showDeleteModal}
					handleClose={handleCloseDeleteModal}
				/>
			</Box>
		</Container>
	);
};

CrudDataGrid.prototypes = {
	/**
	 * The columns to be displayed in the grid.
	 */
	columns: PropTypes.array.isRequired,
	/**
	 * The rows to be displayed in the grid.
	 */
	rows: PropTypes.array.isRequired,
	/**
	 * The hyperlink column field name.
	 */
	hyperlinkColumnFieldName: PropTypes.string.isRequired,
	/**
	 * The hyperlink url.
	 */
	hyperlinkUrl: PropTypes.string.isRequired,
	/**
	 * The loading state of the grid.
	 */
	loading: PropTypes.bool.isRequired,
	/**
	 * The toolbar to be displayed in the grid.
	 */
	toolbar: PropTypes.element.isRequired,
	/**
	 * The singleton name.
	 */
	singleton: PropTypes.string.isRequired,
	/**
	 * The title of the grid.
	 */
	title: PropTypes.string.isRequired,
	/**
	 * The create path.
	 */
	createPath: PropTypes.string.isRequired,
	/**
	 * The delete action.
	 */
	deleteAction: PropTypes.func.isRequired,
};

/**
 * Defines the delete button for the data grid.
 * @param {Object} cellValues - The values of the current cell.
 * @returns {JSX.Element}
 */
const DeleteActionButton = ({ cellValues, setSelectedRecordId, handleOpenDeleteModal, singleton }) => {
	const title = `Delete ${singleton}`;
	return (
		<Button
			id={`deleteRow-${cellValues.row.id}`}
			variant="text"
			color="error"
			onClick={() => {
				setSelectedRecordId(cellValues.row.id);
				handleOpenDeleteModal();
			}}
			aria-label={title}
			title={title}
			startIcon={<DeleteIcon />}
		/>
	);
};

const Header = ({ createLabel, createPath, singleton, title }) => {
	return (
		<Box pb={1} mb={1}>
			<Grid container direction="row" alignItems="center">
				<Typography id="withheader-headertitle" variant={"h4"} component="div">
					{title}
				</Typography>
				<Grid item sx={{ flexGrow: 1 }} />
				<Link id={`create-link-${singleton}`} component={NavLink} to={{ pathname: `${createPath}` }}>
					<Grid id={`create-grid-item-${singleton}`} item ml={2}>
						<Button
							color="primary"
							variant="contained"
							size="small"
							title={createLabel}
							aria-label={createLabel}
							startIcon={<AddIcon />}
							id={`create-${singleton}`}
						>
							{createLabel}
						</Button>
					</Grid>
				</Link>
			</Grid>
		</Box>
	);
};

function mapStateToProps() {
	return {};
}

const mapDispatchToProps = {
	setToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(CrudDataGrid);
