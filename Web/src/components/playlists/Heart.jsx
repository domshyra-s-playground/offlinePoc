import { Skeleton, Tooltip } from "@mui/material";

import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import HeartRatings from "./HeartRatings";
import { connect } from "react-redux";

const Heart = ({ ratingIsLoading, title, playlistRating, playlistId, error, offline }) => {
	const heart = renderHeart(ratingIsLoading, title, playlistRating, playlistId, error, offline);

	return <>{heart()}</>;
};
function renderHeart(ratingIsLoading, title, playlistRating, playlistId, error, offline) {
	const errorMessage = error ? "Error loading rating" : "Offline, ratings unavailable";

	return () => {
		if (error || offline) {
			return (
				<Tooltip title={errorMessage} placement="right" arrow>
					<HeartBrokenIcon color="error" />
				</Tooltip>
			);
		}
		if (!ratingIsLoading) {
			return <HeartRatings title={title} rating={playlistRating?.rating ?? 0} playlistId={playlistId} ratingId={playlistRating?.id} />;
		}
		return <Skeleton variant="rectangular" width={100} height={20} />;
	};
}

function mapStateToProps(state) {
	return {
		offline: !state.connectionStatus.online,
	};
}

export default connect(mapStateToProps)(Heart);
