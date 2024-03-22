import "./App.css";

import { Box, Grid, IconButton, Link, Typography } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { playlistRoot, recommendationsCreate, recommendationsForm, recommendationsRoot } from "../constants/routes";

import GitHubIcon from "@mui/icons-material/GitHub";
import { Layout } from "./Layout";
import { OfflineAlert } from "../components/subcomponets/OfflineAlert";
import PlaylistDetails from "../components/playlists/PlaylistDetails";
import RecommendationForm from "../components/recommendations/Form";
import StyledAppBar from "../components/StyledAppBar";
import ViewPlaylists from "../components/playlists/ViewPlaylists";
import ViewRecommendations from "../components/recommendations/View";
import { connect } from "react-redux";

function App({ status: { online, onlineAt, offlineAt } }) {
	return (
		<BrowserRouter>
			<StyledAppBar />
			<OfflineAlert show={!online} at={online ? onlineAt : offlineAt} />
			<Box sx={{ mb: 2 }}>
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
			</Box>
		</BrowserRouter>
	);
}

function mapStateToProps(state) {
	return {
		status: state.connectionStatus,
	};
}

export default connect(mapStateToProps)(App);
