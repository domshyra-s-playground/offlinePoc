import { useDeleteRecommendationMutation, useGetRecommendationsQuery } from "../redux/services/playlistRecommendationApi";

import React from "react";
import StyledDataGrid from "./subcomponets/StyledDataGrid";

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
];

const ViewRecommendations = () => {
	const { data, isLoading } = useGetRecommendationsQuery();
	const [deleteRecommendation] = useDeleteRecommendationMutation();

	return (
		<StyledDataGrid
			columns={columns}
			loading={isLoading}
			singleton="Recommendation"
			title="Recommendations"
			rows={data ?? []}
			hyperlinkColumnFieldName="name"
			hyperlinkUrl="/recommendations/form/"
			createPath="/recommendations/create"
			deleteAction={(i) => deleteRecommendation(i)}
		/>
	);
};

export default ViewRecommendations;
