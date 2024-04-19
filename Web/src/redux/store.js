import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import connectionStatus from "./slices/connectionStatus";
import inProgressForm from "./slices/inProgressForm";
import { offlineDependenciesApi } from "./services/offlineDependenciesApi";
import { playlistRatingApi } from "./services/playlistRatingApi";
import { playlistRecommendationApi } from "./services/playlistRecommendationApi";
import { spotifyApi } from "./services/spotifyApi";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import toast from "./slices/toast";

//?https://redux-toolkit.js.org/rtk-query/usage/persistence-and-rehydration talks about persisting the api reducer

//?https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist:~:text=It%20is%20also,something%20like%20this%3A outlines that it's a bad idea to persist the api reducer
//It is also strongly recommended to blacklist any api(s) that you have configured with RTK Query. If the api slice reducer is not blacklisted,
//the api cache will be automatically persisted and restored which could leave you with phantom subscriptions from components that do not exist any more.
const persistConfig = {
	key: "root",
	storage,
	whitelist: [offlineDependenciesApi.reducerPath, "inProgressForm"],
	blacklist: [spotifyApi.reducerPath, playlistRatingApi.reducerPath, playlistRecommendationApi.reducerPath, "connectionStatus", "toast"],
};
// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
	[spotifyApi.reducerPath]: spotifyApi.reducer,
	[playlistRatingApi.reducerPath]: playlistRatingApi.reducer,
	[playlistRecommendationApi.reducerPath]: playlistRecommendationApi.reducer,
	[offlineDependenciesApi.reducerPath]: offlineDependenciesApi.reducer,
	toast,
	connectionStatus,
	inProgressForm,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

//?https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
const setupStore = (preloadedState) => {
	return configureStore({
		reducer: persistedReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
				},
			}).concat(spotifyApi.middleware, playlistRatingApi.middleware, playlistRecommendationApi.middleware, offlineDependenciesApi.middleware),
		preloadedState,
	});
};

export default setupStore;
