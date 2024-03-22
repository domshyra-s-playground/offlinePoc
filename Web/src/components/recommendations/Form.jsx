import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { recommendationsForm, recommendationsRoot } from "../../constants/routes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetRecommendationQuery, useUpsertRecommendationMutation } from "../../redux/services/playlistRecommendationApi";
import { useNavigate, useParams } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import { DevTool } from "@hookform/devtools";
import GenericTextItem from "../subcomponets/GenericTextItem";
import { LoadingButton } from "@mui/lab";
import RemoveIcon from "@mui/icons-material/Remove";
import SelectItem from "../subcomponets/SelectItem";
import { connect } from "react-redux";
import { setToast } from "../../redux/slices/toast";
import { useGetGenresQuery } from "../../redux/services/spotifyApi";

// import { useBeforeUnload } from "react-router-dom";


const RecommendationForm = ({ setToast, online }) => {
	const [showLoadingButton, setShowLoadingButton] = useState(false);
	const [songRows, setSongRows] = useState(0);
	const navigate = useNavigate();

	const params = useParams();
	const methods = useForm({
		mode: "onChange",
	});
	const {
		formState: { isDirty, isValid },
	} = methods;

	const { id } = params;
	const isCreateMode = id === undefined;

	const { data, isLoading } = useGetRecommendationQuery(id, { skip: isCreateMode });
	const { data: genres, isLoading: genresAreLoading } = useGetGenresQuery();

	const [upsertRecommendation] = useUpsertRecommendationMutation();

	// //https://reactrouter.com/en/main/hooks/use-blocker
	// //!https://reactrouter.com/en/main/hooks/use-blocker#:~:text=Blocking%20a%20user,from%20navigating%20away.
	// let blocker = useBlocker(() => isDirty && !online);

	// useEffect(() => {
	// 	if (data) {
	// 		methods.reset(data, { keepIsValid: false });
	// 		setSongRows(data?.suggestions?.length ?? 0);
	// 	}
	// }, [methods.reset, data, methods]);

	/**
	 * Save the record
	 * @param {*} form
	 */
	const onFormSubmit = useCallback(
		(form) => {
			setShowLoadingButton(true);
			upsertRecommendation({ data: form, isCreateMode })
				.then((response) => {
					console.log(response);
					if (response.error) {
						setToast({ show: true, message: "Error saving recommendation.", isError: true });
						return;
					}
					setToast({
						show: true,
						message: isCreateMode ? "Recommendation created." : "Recommendation saved.",
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
		[upsertRecommendation, isCreateMode, setToast, navigate]
	);

	const songs = useMemo(() => {
		const songRow = (index) => {
			return (
				<Grid container direction="row" spacing={2} key={index}>
					<Grid item xs={6}>
						<GenericTextItem
							name={`suggestions[${index}].title`}
							id={`suggestions[${index}].title`}
							customControl={methods.control}
							fullWidth
							isLoading={isLoading}
						/>
					</Grid>
					<Grid item xs={6}>
						<GenericTextItem
							name={`suggestions[${index}].artist`}
							id={`suggestions[${index}].artist`}
							customControl={methods.control}
							fullWidth
							isLoading={isLoading}
						/>
					</Grid>
				</Grid>
			);
		};

		const songSection = [];
		for (let i = 0; i < songRows; i++) {
			songSection.push(songRow(i));
		}

		return songSection;
	}, [isLoading, methods.control, songRows]);

	const addSongRowButton = useMemo(() => {
		return (
			<Grid item>
				<Button
					key="addSongRow"
					id="add-song-row-btn"
					type="button"
					color="primary"
					variant="contained"
					size="small"
					startIcon={<AddIcon />}
					onClick={() => setSongRows(songRows + 1)}
				>
					Add Song Row
				</Button>
			</Grid>
		);
	}, [songRows]);

	const removeSongRowButton = useMemo(() => {
		return (
			<Grid item>
				<Button
					key="addSongRow"
					id="add-song-row-btn"
					type="button"
					color="primary"
					variant="contained"
					size="small"
					startIcon={<RemoveIcon />}
					onClick={() => setSongRows(songRows - 1)}
				>
					Remove Song Row
				</Button>
			</Grid>
		);
	}, [songRows]);

	const submitButton = useMemo(() => {
		const btnText = () => {
			if (!online) {
				return "Offline";
			}
			if (isCreateMode) {
				return "Create";
			}
			return "Save";
		};
		const btnDisabled = () => {
			if (!online) {
				return true;
			}
			return !isDirty || !isValid;
		};

		return (
			<LoadingButton
				key="bcegsSubmit"
				id="submit-form-btn"
				type="submit"
				color="primary"
				variant="contained"
				loading={showLoadingButton}
				disabled={btnDisabled()}
			>
				{btnText()}
			</LoadingButton>
		);
	}, [isCreateMode, isDirty, isValid, online, showLoadingButton]);

	return (
		<Container>
			{/* {blocker.state === "blocked" ? (
				<div>
					<p>Are you sure you want to leave?</p>
					<button onClick={() => blocker.proceed()}>Proceed</button>
					<button onClick={() => blocker.reset()}>Cancel</button>
				</div>
			) : null} */}
			<FormProvider key="fireStationForm" {...methods}>
				<Typography variant="h5" gutterBottom>
					{isCreateMode ? "Create" : "Edit"} Recommendation
				</Typography>
				<Box key="bcegsFormBox" component="form" noValidate autoComplete="off" onSubmit={methods.handleSubmit(onFormSubmit)}>
					<Grid container direction="row" spacing={2}>
						<Grid item xs={6}>
							<GenericTextItem
								name="name"
								label="Name"
								id="name"
								rules={{ required: "Name is required." }}
								customControl={methods.control}
								isLoading={isLoading}
							/>
						</Grid>
						<Grid item xs={6}>
							<SelectItem
								name="genre"
								label="Genre"
								id="genre"
								showLabel
								rules={{ required: "Genre is required." }}
								customControl={methods.control}
								isLoading={genresAreLoading}
								options={genres}
							/>
						</Grid>
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
					<Typography variant="h6" gutterBottom>
						Songs
					</Typography>
					<Grid container direction="row" justifyContent={"center"} spacing={2}>
						{addSongRowButton}
						{removeSongRowButton}
					</Grid>
					<Grid container direction="row" py={2} px={2}>
						<Grid item xs={6}>
							<Typography variant="h6">Title</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="h6">Artist</Typography>
						</Grid>
						{songs}
					</Grid>
					<Grid container direction="row" mt={0} py={2}>
						{submitButton}
					</Grid>
					<DevTool control={methods.control} />
				</Box>
			</FormProvider>
		</Container>
	);
};

function mapStateToProps(state) {
	return {
		online: state.connectionStatus.online,
	};
}

const mapDispatchToProps = {
	setToast,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationForm);

