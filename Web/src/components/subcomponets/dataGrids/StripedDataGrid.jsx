import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { Link, Typography } from "@mui/material";
import React, { forwardRef, useCallback } from "react";
import { alpha, styled } from "@mui/material/styles";

import { NavLink } from "react-router-dom";

/**
 * Striped Data Grid component
 * @remarks by default the height is calculated by rows
 * @param {*} props
 * @param enableFiltering
 * @param enablePaging
 * @returns
 */
const StripedDataGrid = forwardRef((props, ref) => {
	const { columns, hyperlinkColumnFieldName, singleton, rows, loading } = props;

	/**
	 * Returns the column that has been indicated to be the hyperlink column.
	 * @returns {Object|null}
	 */
	const getHyperlinkColumn = useCallback(() => {
		if (columns && hyperlinkColumnFieldName) {
			const hyperlinkColumn = columns.filter((column) => column.field === hyperlinkColumnFieldName)[0];
			if (!hyperlinkColumn) {
				console.log("No hyperlink column found.");
			}

			return hyperlinkColumn;
		}
		return null;
	}, [columns, hyperlinkColumnFieldName]);

	const createHyperlinkColumn = useCallback(
		(hyperlinkUrl) => {
			const columnToHyperlink = getHyperlinkColumn();

			if (!columnToHyperlink) {
				//No match was made between the given field name and the column list supplied.
				return null;
			}

			return {
				field: columnToHyperlink.field,
				headerName: columnToHyperlink.headerName,
				filterable: columnToHyperlink.filterable ?? true,
				sortable: columnToHyperlink.sortable ?? true,
				flex: columnToHyperlink.flex,
				type: columnToHyperlink.type,
				renderCell: (cellValues) => {
					return (
						<Link component={NavLink} to={`${getHyperlinkUrl(hyperlinkUrl)}${cellValues.row.id}`} underline="none">
							<Typography id={`${singleton}-${cellValues.row.id}`} color="primary" display="inline" sx={{ fontWeight: "bold" }}>
								{cellValues.row[hyperlinkColumnFieldName]}
							</Typography>
						</Link>
					);
				},
			};
		},
		[getHyperlinkColumn, hyperlinkColumnFieldName, singleton]
	);

	/**
	 * Takes a GridColDef and searches the column prop for a GridColDef which matches the field property.
	 * If the object is found then it is replaces with the passed parameter object.
	 * (https://mui.com/x/api/data-grid/grid-col-def/)
	 * @param columnToReplace
	 * @returns {Object[]|unknown[]}
	 */
	const replaceHyperlinkColumn = useCallback(
		(columnToReplace) => {
			if (columns && hyperlinkColumnFieldName) {
				return columns.map((column) => {
					if (column.field === hyperlinkColumnFieldName) {
						return columnToReplace;
					} else {
						return column;
					}
				});
			}
			return columns;
		},
		[columns, hyperlinkColumnFieldName]
	);

	//TODO! height and autoHeight are not working as expected therefor we just set the height to 60vh
	return (
		<div
			style={{
				height: "60vh",
				width: "100%",
			}}
		>
			<StripedDataGridMui
				{...props}
				rows={rows}
				columnVisibilityModel={props.columnVisibilityModel ?? {}}
				ref={ref}
				getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
				loading={loading}
				columns={replaceHyperlinkColumn(createHyperlinkColumn(props.hyperlinkUrl))}
				pageSizeOptions={[5, 10, 15]}
				initialState={{
					pagination: {
						paginationModel: { pageSize: 10, page: 0 },
					},
				}}
				slots={{
					toolbar: props.toolbar ? props.toolbar : () => null,
				}}
			/>
		</div>
	);
});

const StripedDataGridMui = styled(DataGrid)(({ theme }) => ({
	[`& .${gridClasses.row}.odd`]: {
		backgroundColor: theme.palette.grey[200],
		"&:hover, &.Mui-hovered": {
			backgroundColor: theme.palette.grey[400],
			"@media (hover: none)": {
				backgroundColor: theme.palette.grey[400],
			},
		},
		"&.Mui-selected": {
			backgroundColor: alpha(theme.palette.grey[400], theme.palette.action.selectedOpacity),
			"&:hover, &.Mui-hovered": {
				backgroundColor: alpha(theme.palette.grey[400], theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity),
				// Reset on touch devices, it doesn't add specificity
				"@media (hover: none)": {
					backgroundColor: alpha(theme.palette.grey[400], theme.palette.action.selectedOpacity),
				},
			},
		},
	},
	[`& .${gridClasses.row}.even`]: {
		backgroundColor: "transparent",
		"&:hover, &.Mui-hovered": {
			backgroundColor: theme.palette.grey[400],
			"@media (hover: none)": {
				backgroundColor: theme.palette.grey[400],
			},
		},
		"&.Mui-selected": {
			backgroundColor: alpha(theme.palette.grey[400], theme.palette.action.selectedOpacity),
			"&:hover, &.Mui-hovered": {
				backgroundColor: alpha(theme.palette.grey[400], theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity),
				// Reset on touch devices, it doesn't add specificity
				"@media (hover: none)": {
					backgroundColor: alpha(theme.palette.grey[400], theme.palette.action.selectedOpacity),
				},
			},
		},
	},
}));

/**
 * Returns the hyperlink url with a trailing slash.
 * @returns {*|string}
 */
function getHyperlinkUrl(hyperlinkUrl) {
	if (!hyperlinkUrl) {
		console.log("No hyperlink provided.");
		return "";
	}

	if (hyperlinkUrl.endsWith("/")) {
		return hyperlinkUrl;
	} else {
		return hyperlinkUrl + "/";
	}
}

export default StripedDataGrid;
