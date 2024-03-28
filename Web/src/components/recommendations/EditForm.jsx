import { Box, Container, FormHelperText, Grid, Paper, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { RequiredFields, SongFields, SubmitButton, UnsavedChangesModal, songRowsDefault } from "./Form";
import { recommendationsForm, recommendationsRoot } from "../../constants/routes";
import { useBlocker, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
	useGetRecommendationQuery,
	usePatchRecommendationMutation,
	useUpsertRecommendationMutation,
} from "../../redux/services/playlistRecommendationApi";

import { DevTool } from "@hookform/devtools";
import GenericTextItem from "../subcomponets/GenericTextItem";
import { connect } from "react-redux";
import { setToast } from "../../redux/slices/toast";
import useAutoSave from "../../useAutoSave";
import { useGetGenresQuery } from "../../redux/services/spotifyApi";

//TODO: add remove button to each row for song rather than a global remove button
/**
 * EditRecommendationForm component. used for patches and offline save
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.setToast - Function to set the toast message.
 * @param {boolean} props.online - Flag indicating if the user is online.
 * @returns {JSX.Element} RecommendationForm component.
 */
const EditRecommendationForm = ({ setToast, online, offlineAt, offlineAtDisplay }) => {
	const [showLoadingButton, setShowLoadingButton] = useState(false);

	const [songRows, setSongRows] = useState(songRowsDefault);
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();

	const params = useParams();
	const methods = useForm({
		mode: "onChange",
	});
	const {
		formState: { isDirty, isValid },
	} = methods;

	const { id } = params;

	const { data, isLoading } = useGetRecommendationQuery(id);
	const { data: genres, isLoading: genresAreLoading } = useGetGenresQuery();

	const [upsertRecommendation] = useUpsertRecommendationMutation();
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

	useEffect(() => {
		if (data) {
			methods.reset(data, { keepDefaultValues: false, keepDirty: false });
			const loadedSongRows = data?.suggestions?.length > 0 ? data?.suggestions.map((item) => item.id) : songRowsDefault;
			setSongRows(loadedSongRows);
		}
	}, [methods.reset, data, methods]);

	/**
	 * Save the record
	 * @param {*} form
	 */
	const onFormSubmit = useCallback(
		(form) => {
			setShowLoadingButton(true);
			upsertRecommendation({ data: form, isCreateMode: false })
				.then((response) => {
					console.log(response);
					if (response.error) {
						setToast({ show: true, message: "Error saving recommendation.", isError: true });
						return;
					}
					setToast({
						show: true,
						message: "Recommendation saved.",
						link: `${recommendationsForm}${response.data.id}`,
					});
					navigate(recommendationsRoot);
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {
					setShowLoadingButton(false);
				});
		},
		[upsertRecommendation, setToast, navigate]
	);

	return (
		<Container>
			{showModal ? <UnsavedChangesModal key={showModal ? "unsaved-changes" : ""} blocker={blocker} setShowModal={setShowModal} /> : null}
			<FormProvider key="fireStationForm" {...methods}>
				<Typography variant="h5" gutterBottom>
					Edit Recommendation
				</Typography>
				<Box key="bcegsFormBox" component="form" noValidate autoComplete="off" onSubmit={methods.handleSubmit(onFormSubmit)}>
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
					<SongFields songRows={songRows} setSongRows={setSongRows} isLoading={isLoading} setValue={methods.setValue} />
					<LastSavedText savedAt={savedAt} key={savedAt} />
					<Grid container direction="row" mt={0} py={2}>
						<SubmitButton
							isCreateMode={false}
							isDirty={isDirty}
							isValid={isValid}
							online={online}
							offlineAt={offlineAt}
							offlineAtDisplay={offlineAtDisplay}
							showLoadingButton={showLoadingButton}
							lastSaved={savedAt}
						/>
					</Grid>
					<DevTool control={methods.control} />
				</Box>
			</FormProvider>
		</Container>
	);
};

const LastSavedText = ({ savedAt }) => {
	return (
		<FormHelperText sx={{ textAlign: "left" }} pb={0}>
			{savedAt ? `Last saved at ${savedAt.toLocaleTimeString()}` : null}
		</FormHelperText>
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
