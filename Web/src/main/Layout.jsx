import "./App.css";

import { Box, Grid, IconButton, Link, Typography } from "@mui/material";

import GitHubIcon from "@mui/icons-material/GitHub";
import { OfflineAlert } from "../components/subcomponets/OfflineAlert";
import { Outlet } from "react-router-dom";
import StyledAppBar from "../components/StyledAppBar";
import { ToastLayout } from "./ToastLayout";
import { connect } from "react-redux";

function Layout({ status: { online, onlineAt, offlineAt, offlineAtDisplay } }) {
	return (
		<>
			<StyledAppBar />
			<OfflineAlert show={!online} at={online ? onlineAt : offlineAt} displayAt={offlineAtDisplay} />
			<Box sx={{ mb: 2 }}>
				<div className="App">
					<Grid mt={2}>
						<ToastLayout>
							<Outlet />
						</ToastLayout>
					</Grid>
					<Grid container justifyContent="center" pb={2}>
						<Grid item xs={12}>
							<IconButton title="view code on github" href="https://github.com/domshyra-s-playground/offlinePoc" target="_blank">
								<GitHubIcon />
							</IconButton>
						</Grid>
						<Grid item xs={12}>
							<Typography component="div" variant="caption" color="text.secondary" align="center">
								View this code on{" "}
								<Link rel="noopener" target="_blank" href="https://github.com/domshyra-s-playground/offlinePoc" underline="none">
									GitHub
								</Link>
							</Typography>
						</Grid>
					</Grid>
				</div>
			</Box>
		</>
	);
}

function mapStateToProps(state) {
	return {
		status: state.connectionStatus,
	};
}

export default connect(mapStateToProps)(Layout);
