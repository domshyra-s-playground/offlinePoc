import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import Config from "../../config";

const fetchUrl = `${Config.baseApiUrl}recommendations`;
const tagType = "Recommendation";

//?https://redux-toolkit.js.org/rtk-query/usage/queries
export const playlistRecommendationApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: fetchUrl }),
	reducerPath: "playlistRecommendationApi",
	endpoints: (build) => ({
		getRecommendations: build.query({
			query: () => ``,
			providesTags: (result, _error, _arg) => (result ? [...result.map(({ id }) => ({ type: tagType, id })), tagType] : [tagType]),
		}),
		getRecommendation: build.query({
			query: (id) => `/${id}`,
			providesTags: (_result, _err, id) => [{ type: tagType, id }],
		}),
		upsertRecommendation: build.mutation({
			query({ isCreateMode, data }) {
				return {
					url: ``,
					method: isCreateMode ? "POST" : "PUT",
					headers: { "Content-Type": "application/json", Accept: "application/json" },
					body: JSON.stringify(data),
				};
			},
			invalidatesTags: (result, _error, arg) => {
				if (arg.isCreateMode) {
					return [tagType];
				}
				return [{ type: tagType, id: result.id }];
			},
		}),
		patchRecommendation: build.mutation({
			query({ id, operations }) {
				return {
					url: `/${id}`,
					method: "Patch",
					headers: { "Content-Type": "application/json-path+json", Accept: "*/*" },
					body: operations,
				};
			},
			invalidatesTags: (_result, _error, arg) => [{ type: tagType, id: arg.id }],
		}),
		deleteRecommendation: build.mutation({
			query(id) {
				return {
					url: `/${id}`,
					method: "DELETE",
				};
			},
			invalidatesTags: (_result, _error, id) => [{ type: tagType, id: id }],
		}),
	}),
	tagTypes: [tagType],
});

export const {
	useGetRecommendationsQuery,
	useGetRecommendationQuery,
	useUpsertRecommendationMutation,
	useDeleteRecommendationMutation,
	usePatchRecommendationMutation,
} = playlistRecommendationApi;
