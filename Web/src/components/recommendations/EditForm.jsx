import { Box, Container, FormHelperText, Grid, Paper, Tooltip, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { RequiredFields, SongFields, UnsavedChangesModal } from "./CreateForm";
import { useBlocker, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetRecommendationQuery, usePatchRecommendationMutation } from "../../redux/services/playlistRecommendationApi";

import { DevTool } from "@hookform/devtools";
import GenericTextItem from "../subcomponets/GenericTextItem";
import { connect } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { setToast } from "../../redux/slices/toast";
import useAutoSave from "../../useAutoSave";
import { useGetGenresQuery } from "../../redux/services/spotifyApi";
import { useTheme } from "@mui/material/styles";
import { v4 as uuidv4 } from "uuid";

/**
 * EditRecommendationForm component. used for patches and offline save
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.setToast - Function to set the toast message.
 * @param {boolean} props.online - Flag indicating if the user is online.
 * @returns {JSX.Element} RecommendationForm component.
 */
const EditRecommendationForm = ({ setToast, online, offlineAtDisplay }) => {
	const [songRows, setSongRows] = useState([uuidv4()]);
	const [showModal, setShowModal] = useState(false);
	const [recommendationLoaded, setRecommendationLoaded] = useState(false);

	const params = useParams();
	const methods = useForm({
		mode: "onChange",
	});
	const {
		formState: { isDirty },
	} = methods;

	const { id } = params;

	const { data: recommendation, isLoading } = useGetRecommendationQuery(id);
	const { data: genres, isLoading: genresAreLoading } = useGetGenresQuery();

	const [patchRecommendation] = usePatchRecommendationMutation();

	//https://reactrouter.com/en/main/hooks/use-blocker
	//!https://reactrouter.com/en/main/hooks/use-blocker#:~:text=Blocking%20a%20user,from%20navigating%20away.
	let blocker = useBlocker(() => isDirty && !online);

	const { savedAt } = useAutoSave(
		methods.formState.defaultValues,
		methods.formState.isDirty,
		methods.getValues,
		methods.resetField,
		params.id,
		"Recommendation",
		patchRecommendation,
		setToast,
		!online
	);

	useEffect(() => {
		setShowModal(blocker.state === "blocked");
	}, [blocker.state]);

	//used for the initial load of the form
	useEffect(() => {
		if (recommendation && !recommendationLoaded) {
			methods.reset(recommendation, { keepDefaultValues: false, keepDirty: false });
			const loadedSongRows = recommendation?.suggestions?.length > 0 ? recommendation?.suggestions.map((item) => item.id) : [uuidv4()];
			setSongRows(loadedSongRows);
			//This is to prevent the form from resetting data when we patch the record
			setRecommendationLoaded(true);
		}
	}, [methods.reset, recommendation, methods, recommendationLoaded]);

	return (
		<Container>
			{showModal ? <UnsavedChangesModal key={showModal ? "unsaved-changes" : ""} blocker={blocker} setShowModal={setShowModal} /> : null}
			<FormProvider key="fireStationForm" {...methods}>
				<Typography variant="h5" gutterBottom>
					Edit Recommendation
				</Typography>
				<Box key="bcegsFormBox" component="form" noValidate autoComplete="off">
					<Paper elevation={2}>
						<Box p={2} mb={2}>
							<Grid container direction="row" spacing={2}>
								<RequiredFields genres={genres} genresAreLoading={genresAreLoading} isLoading={isLoading} control={methods.control} />
							</Grid>
							<Grid container direction="row" spacing={2} py={1}>
								<Grid item xs={12}>
									<GenericTextItem
										name="description"
										label="Description"
										id="description"
										customControl={methods.control}
										isLoading={isLoading}
										multiline
										fullWidth
									/>
								</Grid>
							</Grid>
						</Box>
					</Paper>
					<SongFields
						songRows={songRows}
						setSongRows={setSongRows}
						isLoading={isLoading}
						setValue={methods.setValue}
						getValues={methods.getValues}
					/>
					<LastSavedText savedAt={savedAt} key={savedAt} offline={!online} offlineAtDisplay={offlineAtDisplay} />
					<DevTool control={methods.control} />
				</Box>
			</FormProvider>
		</Container>
	);
};

const LastSavedText = ({ savedAt, offline, offlineAtDisplay }) => {
	const [showRelativeTime, setShowRelativeTime] = useState(false);
	dayjs.extend(relativeTime);
	const theme = useTheme();
	const errorStyle = theme.palette.error.main;
	return (
		<>
			{offline ? (
				<FormHelperText sx={{ textAlign: "left", color: errorStyle }} pb={0}>
					{`Offline since ${offlineAtDisplay}, changes will be saved when you're back online.`}
				</FormHelperText>
			) : null}
			<FormHelperText
				sx={{ textAlign: "left" }}
				pb={0}
				onClick={() => {
					setShowRelativeTime(!showRelativeTime);
				}}
			>
				{savedAt ? (
					<Tooltip title={showRelativeTime ? `${savedAt.toLocaleTimeString()}` : `${dayjs(savedAt).fromNow()}`}>
						Last saved at {showRelativeTime ? dayjs(savedAt).fromNow() : savedAt.toLocaleTimeString()}
					</Tooltip>
				) : null}
			</FormHelperText>
		</>
	);
};

function mapStateToProps(state) {
	return {
		online: state.connectionStatus.online,
		offlineAt: state.connectionStatus.offlineAt,
		offlineAtDisplay: state.connectionStatus.offlineAtDisplay,
	};
}

const mapDispatchToProps = {
	setToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditRecommendationForm);
