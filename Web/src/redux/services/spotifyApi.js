import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import Config from "../../config";

const fetchUrl = `${Config.baseApiUrl}spotify`;

const tagType = "Playlist";
const immutableDataTimeout = 60 * 60 * 4000; //4 hours

//?https://redux-toolkit.js.org/rtk-query/usage/queries
export const spotifyApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: fetchUrl }),
	reducerPath: "spotifyApi",
	endpoints: (build) => ({
		getPlaylists: build.query({
			query: () => ``,
			providesTags: (result) => (result ? [...result.map(({ playlistId }) => ({ type: tagType, playlistId })), tagType] : [tagType]),
		}),
		getPlaylist: build.query({
			query: (playlistId) => `/${playlistId}`,
			providesTags: (_result, _err, playlistId) => [{ type: tagType, playlistId }],
		}),
		getGenres: build.query({
			query: () => `/genres`,
			providesTags: () => ["genres"],
			keepUnusedDataFor: immutableDataTimeout,
		}),
	}),
	tagTypes: [tagType],
});

export const { useGetPlaylistsQuery, useGetPlaylistQuery, useGetGenresQuery } = spotifyApi;
