import { RouterProvider, createBrowserRouter } from "react-router-dom";

import EditRecommendationForm from "../components/recommendations/EditForm";
import Layout from "./Layout";
import PlaylistDetails from "../components/playlists/PlaylistDetails";
import RecommendationForm from "../components/recommendations/Form";
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
					{ path: "create", Component: RecommendationForm },
					{ path: "form/:id", Component: EditRecommendationForm },
				],
			},
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
