import { Box, Container, Grid, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import PlaylistCard from "./PlaylistCardSelfFetching";
import { useGetPlaylistsQuery } from "../../redux/services/spotifyApi";
import { useGetRatingsQuery } from "../../redux/services/playlistRatingApi";

const ViewPlaylists = () => {
	const { data, isLoading } = useGetPlaylistsQuery();
	const [cards, setCards] = useState([]);

	useGetRatingsQuery();

	useEffect(() => {
		if (!isLoading && data) {
			setCards(renderCards(data));
		}
	}, [data, isLoading]);

	const renderCards = (data) => {
		return data.map((item) => (
			<Grid item xs={12} xl={3} md={5} sm={6} pb={2} px={1} mx={1} key={item.playlistId}>
				<PlaylistCard {...item} />
			</Grid>
		));
	};

	return (
		<>
			<Container>
				<Box sx={{ justifyContent: "center" }}>
					<Typography variant="h3" gutterBottom>
						Playlists
					</Typography>
				</Box>
			</Container>
			<Box mb={2} pb={2}>
				<Grid container spacing={1} sx={{ justifyContent: "center" }}>
					{!isLoading ? cards : <Skeleton />}
				</Grid>
			</Box>
		</>
	);
};

export default ViewPlaylists;
