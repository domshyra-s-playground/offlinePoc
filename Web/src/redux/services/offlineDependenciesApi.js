import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import Config from "../../config";
import { REHYDRATE } from "redux-persist";

const fetchUrl = `${Config.baseApiUrl}spotify`;
const unusedDataConst = 60 * 60 * 4000; //4 hours

function isHydrateAction(action) {
	return action.type === REHYDRATE;
}

//?https://redux-toolkit.js.org/rtk-query/usage/queries
//This is persisted because it's used in the offlineDependenciesApi, this is because these are immutable and the cache
//Generally persisting and rehydrating an api slice might always leave the user with very stale data if the user has not visited the page for some time
export const offlineDependenciesApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: fetchUrl }),
	reducerPath: "offlineDependenciesApi",
	// to prevent circular type issues, the return type needs to be annotated as any
	// extractRehydrationInfo(action, { reducerPath }) {
	// 	if (isHydrateAction(action)) {
	// 		// when persisting the api reducer
	// 		if (action.key === "root") {
	// 			return action.payload;
	// 		}

	// 		// When persisting the root reducer
	// 		return action.payload[reducerPath];
	// 	}
	// },
	endpoints: (build) => ({
		getGenres: build.query({
			query: () => `/genres`,
			providesTags: () => ["genres"],
			keepUnusedDataFor: unusedDataConst,
		}),
	}),
	tagTypes: ["genres"],
});

export const { useGetGenresQuery } = offlineDependenciesApi;
