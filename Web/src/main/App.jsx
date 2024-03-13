import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Grid, IconButton, Link, Typography } from "@mui/material";

import GitHubIcon from "@mui/icons-material/GitHub";
import PlaylistDetails from "../components/PlaylistDetails";
import RecommendationForm from "../components/forms/RecommendationForm";
import StyledAppBar from "../components/StyledAppBar";
import ViewPlaylists from "../components/ViewPlaylists";
import ViewRecommendations from "../components/ViewRecommendations";

function App() {
	return (
		<BrowserRouter>
			<StyledAppBar />
			<div className="App">
				<Grid mt={2}>
					<Routes>
						<Route path="/" element={<ViewPlaylists />} />
						<Route path="/playlist/:playlistId" element={<PlaylistDetails />} />
						<Route path="/recommendations" element={<ViewRecommendations />} />
						<Route path="/recommendations/create" element={<RecommendationForm />} />
						<Route path="/recommendations/form/:id" element={<RecommendationForm />} />
					</Routes>
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
