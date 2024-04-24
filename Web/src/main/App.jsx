import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useGetGenresQuery, useGetPlaylistsQuery } from "../redux/services/spotifyApi";

import CreateRecommendationForm from "../components/recommendations/CreateForm";
import EditRecommendationForm from "../components/recommendations/EditForm";
import Layout from "./Layout";
import PlaylistDetails from "../components/playlists/PlaylistDetails";
import ViewPlaylists from "../components/playlists/ViewPlaylists";
import ViewRecommendations from "../components/recommendations/View";
import { recommendationsRoot } from "../constants/routes";

const router = createBrowserRouter([
	{
		Component: Layout,
		children: [
			{
				path: "/",
				children: [
					{ index: true, Component: ViewPlaylists },
					{ path: "playlist/:playlistId", Component: PlaylistDetails },
				],
			},
			{
				path: `${recommendationsRoot}/`,
				children: [
					{ index: true, Component: ViewRecommendations },
					{ path: "create", Component: CreateRecommendationForm },
					{ path: "form/:id", Component: EditRecommendationForm },
				],
			},
		],
	},
]);

export default function App() {
	//api data required for offline, this is so the service worker can cache the data on the first load / install
	useGetGenresQuery();
	useGetPlaylistsQuery();

	return <RouterProvider router={router} />;
}
