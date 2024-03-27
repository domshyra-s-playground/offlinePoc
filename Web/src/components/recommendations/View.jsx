import { recommendationsCreate, recommendationsForm } from "../../constants/routes";
import { useDeleteRecommendationMutation, useGetRecommendationsQuery } from "../../redux/services/playlistRecommendationApi";

import React from "react";
import StyledDataGrid from "../subcomponets/StyledDataGrid";
import { recommendationsLabel } from "../../constants/labels";
import { useGetGenresQuery } from "../../redux/services/spotifyApi";

const ViewRecommendations = () => {
	const { data, isLoading } = useGetRecommendationsQuery();
	const [deleteRecommendation] = useDeleteRecommendationMutation();

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
			deleteAction={deleteRecommendation}
		/>
	);
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

export default ViewRecommendations;
