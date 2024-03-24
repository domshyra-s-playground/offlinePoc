import React, { useCallback } from "react";
import { recommendationsCreate, recommendationsForm } from "../../constants/routes";
import { useDeleteRecommendationMutation, useGetRecommendationsQuery } from "../../redux/services/playlistRecommendationApi";

import StyledDataGrid from "../subcomponets/StyledDataGrid";
import { connect } from "react-redux";
import { recommendationsLabel } from "../../constants/labels";
import { setToast } from "../../redux/slices/toast";
import { useGetGenresQuery } from "../../redux/services/spotifyApi";

const ViewRecommendations = ({ setToast }) => {
	const { data, isLoading } = useGetRecommendationsQuery();
	const [deleteRecommendation] = useDeleteRecommendationMutation();

	const deleteRow = useCallback(
		(id) => {
			deleteRecommendation(id);
			setToast({ show: true, message: "Recommendation deleted." });
		},
		[deleteRecommendation, setToast]
	);

	//Grab the genres from the Spotify API for offline use
	useGetGenresQuery();
	return (
		<StyledDataGrid
			columns={columns}
			loading={isLoading}
			singleton="Recommendation"
			title={recommendationsLabel}
			rows={data ?? []}
			hyperlinkColumnFieldName="name"
			hyperlinkUrl={recommendationsForm}
			createPath={recommendationsCreate}
			deleteAction={deleteRow}
		/>
	);
};
function mapStateToProps() {
	return {};
}

const mapDispatchToProps = {
	setToast,
};
const columns = [
	{
		field: "name",
		headerName: "Name",
		flex: 3,
		type: "string",
	},
	{
		field: "description",
		headerName: "Description",
		flex: 3,
		type: "string",
	},
	{
		field: "genre",
		headerName: "Genre",
		flex: 3,
		type: "string",
	},
];


export default connect(mapStateToProps, mapDispatchToProps)(ViewRecommendations);
