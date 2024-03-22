import { combineReducers, configureStore } from "@reduxjs/toolkit";

import connectionStatus from "./slices/connectionStatus";
import { playlistRatingApi } from "./services/playlistRatingApi";
import { playlistRecommendationApi } from "./services/playlistRecommendationApi";
import { spotifyApi } from "./services/spotifyApi";
import toast from "./slices/toast";

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
	[spotifyApi.reducerPath]: spotifyApi.reducer,
	[playlistRatingApi.reducerPath]: playlistRatingApi.reducer,
	[playlistRecommendationApi.reducerPath]: playlistRecommendationApi.reducer,
	toast,
	connectionStatus,
});

const setupStore = (preloadedState) => {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(spotifyApi.middleware, playlistRatingApi.middleware, playlistRecommendationApi.middleware),
		preloadedState,
	});
};

export default setupStore;
