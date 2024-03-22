import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Grid, IconButton, Link, Typography } from "@mui/material";
import { playlistRoot, recommendationsCreate, recommendationsForm, recommendationsRoot } from "../constants/routes";

import GitHubIcon from "@mui/icons-material/GitHub";
import { Layout } from "./Layout";
import PlaylistDetails from "../components/playlists/PlaylistDetails";
import RecommendationForm from "../components/recommendations/Form";
import StyledAppBar from "../components/StyledAppBar";
import ViewPlaylists from "../components/playlists/ViewPlaylists";
import ViewRecommendations from "../components/recommendations/View";

function App() {
	return (
		<BrowserRouter>
			<StyledAppBar />
			<div className="App">
				<Grid mt={2}>
					<Layout>
						<Routes>
							<Route path="/" element={<ViewPlaylists />} />
							<Route path={`${playlistRoot}/:playlistId`} element={<PlaylistDetails />} />
							<Route path={recommendationsRoot} element={<ViewRecommendations />} />
							<Route path={recommendationsCreate} element={<RecommendationForm />} />
							<Route path={`${recommendationsForm}:id`} element={<RecommendationForm />} />
						</Routes>
					</Layout>
				</Grid>
				<Grid container justifyContent="center" pb={2}>
					<Grid item xs={12}>
						<IconButton title="view code on github" href="https://github.com/domshyra/domshyra" target="_blank">
							<GitHubIcon />
						</IconButton>
					</Grid>
					<Grid item xs={12}>
						<Typography component="div" variant="caption" color="text.secondary" align="center">
							View this code on{" "}
							<Link rel="noopener" target="_blank" href="https://github.com/domshyra/domshyra" underline="none">
								GitHub
							</Link>
						</Typography>
					</Grid>
				</Grid>
			</div>
		</BrowserRouter>
	);
}

export default App;
