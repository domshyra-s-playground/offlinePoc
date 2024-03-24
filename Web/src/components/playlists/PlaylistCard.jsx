import * as React from "react";

import { Box, Button, Tooltip } from "@mui/material";

import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import OpenInSpotifyText from "../subcomponets/OpenInfSpotify";
import { PropTypes } from "prop-types";
import Typography from "@mui/material/Typography";
import { playlistRoot } from "../../constants/routes";
import { renderHeart } from "./HeartRatings";
import { useNavigate } from "react-router-dom";

const PlaylistCard = ({ title, imageURL, description, genre, trackAndFollowerText, ratingIsLoading, playlistRating, playlistId }) => {
	const sectionWidth = 215;
	const cardWidth = sectionWidth * 2;

	return (
		// TODO: make card into a class
		<Card sx={{ display: "flex", width: cardWidth, minHeight: 200 }} className="Cardbk">
			<Box sx={{ display: "flex", flexDirection: "column" }}>
				<CardContent sx={{ flex: "1 0 auto", width: sectionWidth }}>
					<DesktopCardContent
						title={title}
						ratingIsLoading={ratingIsLoading}
						description={description}
						genre={genre}
						trackAndFollowerText={trackAndFollowerText}
						playlistRating={playlistRating}
						playlistId={playlistId}
					/>
					<MobileCardContent
						title={title}
						genre={genre}
						ratingIsLoading={ratingIsLoading}
						trackAndFollowerText={trackAndFollowerText}
						description={description}
						playlistRating={playlistRating}
						playlistId={playlistId}
					/>
				</CardContent>
				{/* desktop */}
				<Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", pl: 1, maxWidth: sectionWidth }}>
					<Tooltip title={genre} placement="bottom-end" arrow>
						<Button aria-label="genre" color="secondary" size="small" startIcon={<MusicNoteIcon />}>
							Genre
						</Button>
					</Tooltip>
					<Typography sx={{ flex: "1 0 auto" }}>{/*left blank for spacing*/}</Typography>
					<Typography variant="caption" color="text.secondary.light" noWrap align="right">
						{trackAndFollowerText}
					</Typography>
				</Box>
			</Box>
			<CardMedia component={AspectRatio} ratio="4/3" objectFit="contain" sx={{ width: sectionWidth }} image={imageURL} alt={`${title} image`} />
		</Card>
	);
};

const DescriptionCardContent = ({ title, description, ratingIsLoading, playlistRating, playlistId }) => {
	const heart = renderHeart(ratingIsLoading, title, playlistRating, playlistId);

	return (
		<>
			<Typography variant="subtitle2" color="text.secondary" component="div" gutterBottom>
				{description}
			</Typography>
			{heart()}
			{OpenInSpotifyText(playlistId)}
		</>
	);
};

const DesktopCardContent = ({ title, playlistId }) => {
	const nav = useNavigate();

	return (
		<>
			<Typography
				sx={{ display: { xs: "none", md: "block" } }}
				component="div"
				variant="h6"
				color="primary"
				onClick={() => nav(`${playlistRoot}/${playlistId}`)}
			>
				{title}
			</Typography>
		</>
	);
};

const MobileCardContent = ({ title, genre, ratingIsLoading, trackAndFollowerText, description, playlistRating, playlistId }) => {
	return (
		<>
			<Typography sx={{ display: { xs: "block", md: "none" } }} component="div" variant="h6" color="text.secondary.light">
				{title}
			</Typography>
			<DescriptionCardContent title={title} description={description} playlistId={playlistId} playlistRating={ratingIsLoading} />
			<Typography sx={{ display: { xs: "block", md: "none" } }} component="div" variant="caption" color="text.secondary" align="center">
				{genre}
			</Typography>
			<Typography sx={{ display: { xs: "block", md: "none" } }} component="div" variant="caption" color="text.secondary.light" align="center">
				{trackAndFollowerText}
			</Typography>
		</>
	);
};

PlaylistCard.propType = {
	title: PropTypes.string,
	anchorId: PropTypes.string,
	description: PropTypes.string,
	genre: PropTypes.string,
	spotifyMusicLink: PropTypes.string,
	imageURL: PropTypes.string,
	playlistId: PropTypes.string,
	trackAndFollowerText: PropTypes.string,
};

export default PlaylistCard;
