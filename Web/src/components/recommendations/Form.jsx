import { Alert, AlertTitle, Box, Button, Container, FormHelperText, Grid, Paper, Stack, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { recommendationsForm, recommendationsRoot } from "../../constants/routes";
import { useBlocker, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import ConfirmationModal from "../subcomponets/modals/ConfirmationModal";
import { DevTool } from "@hookform/devtools";
import GenericTextItem from "../subcomponets/GenericTextItem";
import { LoadingButton } from "@mui/lab";
import RemoveIcon from "@mui/icons-material/Remove";
import SelectItem from "../subcomponets/SelectItem";
import { connect } from "react-redux";
import { setToast } from "../../redux/slices/toast";
import { useGetGenresQuery } from "../../redux/services/spotifyApi";
import { useUpsertRecommendationMutation } from "../../redux/services/playlistRecommendationApi";

/**
 * RecommendationForm component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.setToast - Function to set the toast message.
 * @param {boolean} props.online - Flag indicating if the user is online.
 * @returns {JSX.Element} RecommendationForm component.
 */
const RecommendationForm = ({ setToast, online, offlineAt, offlineAtDisplay }) => {
	const [showLoadingButton, setShowLoadingButton] = useState(false);
	const [songRows, setSongRows] = useState(songRowsDefault);
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();
	const methods = useForm({
		mode: "onChange",
	});
	const {
		formState: { isDirty, isValid },
	} = methods;

	const { data: genres, isLoading: genresAreLoading } = useGetGenresQuery();

	const [upsertRecommendation] = useUpsertRecommendationMutation();

	//https://reactrouter.com/en/main/hooks/use-blocker
	//!https://reactrouter.com/en/main/hooks/use-blocker#:~:text=Blocking%20a%20user,from%20navigating%20away.
	let blocker = useBlocker(() => isDirty && !online);

	useEffect(() => {
		setShowModal(blocker.state === "blocked");
	}, [blocker.state]);

	/**
	 * Save the record
	 * @param {*} form
	 */
	const onFormSubmit = useCallback(
		(form) => {
			setShowLoadingButton(true);
			upsertRecommendation({ data: form, isCreateMode: true })
				.then((response) => {
					console.log(response);
					if (response.error) {
						setToast({ show: true, message: "Error saving recommendation.", isError: true });
						return;
					}
					setToast({
						show: true,
						message: "Recommendation created.",
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
					Create Recommendation
				</Typography>
				<Box key="bcegsFormBox" component="form" noValidate autoComplete="off" onSubmit={methods.handleSubmit(onFormSubmit)}>
					<Paper elevation={2}>
						<Box p={2} mb={2}>
							<Grid container direction="row" spacing={2}>
								<RequiredFields genres={genres} genresAreLoading={genresAreLoading} control={methods.control} />
							</Grid>
							<Grid container direction="row" spacing={2} py={1}>
								<Grid item xs={12}>
									<GenericTextItem
										name="description"
										label="Description"
										id="description"
										customControl={methods.control}
										multiline
										fullWidth
									/>
								</Grid>
							</Grid>
						</Box>
					</Paper>
					<SongFields control={methods.control} songRows={songRows} setSongRows={setSongRows} setValue={methods.setValue} />
					<Grid container direction="row" mt={0} py={2}>
						<SubmitButton
							isCreateMode={true}
							isDirty={isDirty}
							isValid={isValid}
							online={online}
							offlineAt={offlineAt}
							offlineAtDisplay={offlineAtDisplay}
							showLoadingButton={showLoadingButton}
						/>
					</Grid>
					<DevTool control={methods.control} />
				</Box>
			</FormProvider>
		</Container>
	);
};

const SongFields = ({ control, songRows, setSongRows, setValue }) => {
	const removeRow = (guid, index) => {
		const updatedRows = [...songRows].filter((item) => item.id !== guid);
		setValue(`suggestions[${index}].title`, "");
		setValue(`suggestions[${index}].artist`, "");
		setSongRows(updatedRows);
	};

	return (
		<Paper elevation={1}>
			<Box p={2}>
				<Typography variant="h5" py={1} gutterBottom>
					Songs
				</Typography>
				<Grid container direction="row" justifyContent={"center"} spacing={2}>
					<AddSongRowButton setSongRows={setSongRows} songRows={songRows} />
				</Grid>
				<Grid container direction="row" py={2} px={2}>
					<Grid item xs={6}>
						<Typography variant="h6">Title</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography variant="h6">Artist</Typography>
					</Grid>
					<Songs control={control} songRows={songRows} removeRow={removeRow} />
				</Grid>
			</Box>
		</Paper>
	);
};

/**
 * Memoized JSX element representing the required fields in the form.
 * Both Name and Genre are required fields.
 * @type {JSX.Element}
 */
const RequiredFields = ({ genres, genresAreLoading, isLoading, control }) => {
	return (
		<>
			<Grid item xs={8}>
				<GenericTextItem
					name="name"
					label="Name"
					id="name"
					rules={{ required: "Name is required." }}
					customControl={control}
					isLoading={isLoading}
				/>
			</Grid>
			<Grid item xs={4}>
				<SelectItem
					name="genre"
					label="Genre"
					id="genre"
					showLabel
					rules={{ required: "Genre is required." }}
					customControl={control}
					isLoading={genresAreLoading}
					options={genres}
				/>
			</Grid>
		</>
	);
};

/**
 * Represents a list of songs.
 * @type {React.ReactNode}
 */
const Songs = ({ isLoading, control, songRows, removeRow }) => {
	const songRow = (index, guid) => {
		return (
			<Grid container direction="row" spacing={2} key={guid}>
				<Grid item xs={5}>
					<GenericTextItem
						name={`suggestions[${index}].title`}
						id={`suggestions[${index}].title`}
						customControl={control}
						fullWidth
						isLoading={isLoading}
					/>
				</Grid>
				<Grid item xs={5}>
					<GenericTextItem
						name={`suggestions[${index}].artist`}
						id={`suggestions[${index}].artist`}
						customControl={control}
						fullWidth
						isLoading={isLoading}
					/>
				</Grid>
				<Grid item xs={2}>
					<Button
						key="removeSongRow"
						id={`remove-song-row-btn-${index}`}
						type="button"
						color="primary"
						variant="outlined"
						size="small"
						startIcon={<RemoveIcon />}
						onClick={() => {
							removeRow(guid, index);
						}}
					>
						Remove
					</Button>
				</Grid>
			</Grid>
		);
	};

	const songSection = [];
	for (let i = 0; i < songRows.length; i++) {
		const mainId = songRows[i].id;
		songSection.push(songRow(i, mainId ?? i));
	}

	return songSection;
};

/**
 * The submit button component.
 *
 * @returns {JSX.Element} The submit button JSX element.
 */
const SubmitButton = ({ isCreateMode, isDirty, isValid, online, offlineAt, offlineAtDisplay, showLoadingButton, lastSaved }) => {
	const formIsModified = isDirty || !isValid;

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
		if (!isCreateMode && online && offlineAt && formIsModified) {
			//show save button only after we have been offline and the form is dirty
			return true;
		}

		return !isDirty || !isValid;
	};
	const showButton = (offlineAt && online && formIsModified && lastSaved > offlineAt) || isCreateMode;

	if (!isCreateMode && !offlineAt) {
		return null;
	}

	return (
		<>
			<Stack spacing={2}>
				<SubmitButtonHelperText online={online} offlineAt={offlineAt} offlineAtDisplay={offlineAtDisplay} lastSaved={showButton} />
			</Stack>
			{showButton ? (
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
			) : null}
		</>
	);
};

const SubmitButtonHelperText = ({ online, offlineAt, offlineAtDisplay, showButton }) => {
	return (
		<>
			{offlineAt && !online ? (
				<FormHelperText sx={{ textAlign: "left" }} pb={0}>
					You have went offline, we cannot auto save.
				</FormHelperText>
			) : null}
			{showButton ? (
				<FormHelperText sx={{ textAlign: "left" }} pb={0}>
					You have went back online, we have haven't saved since {offlineAtDisplay}. Please hit save when ready.
				</FormHelperText>
			) : null}
		</>
	);
};

/**
 * The modal component used for displaying a confirmation dialog.
 *
 * @typedef {Object} Modal
 * @property {boolean} showModal - Determines whether the modal is visible or not.
 * @property {Function} handleClose - Callback function to handle the modal close event.
 * @property {Function} confirmAction - Callback function to handle the confirm action.
 * @property {React.ComponentType} ModalBody - The body component of the modal.
 */
const UnsavedChangesModal = ({ blocker, setShowModal }) => {
	/**
	 * Renders the modal body component.
	 * @returns {JSX.Element} The rendered modal body.
	 */
	const ModalBody = useMemo(() => {
		return (
			<Typography align="center" fontWeight={"bold"} pt={3}>
				All data will be lost
			</Typography>
		);
	}, []);
	/**
	 * Renders the modal title component.
	 * @returns {JSX.Element} The rendered modal body.
	 */
	const ModalTitle = useMemo(() => {
		return (
			<Alert severity="error" variant="filled">
				<AlertTitle>Warning!</AlertTitle>
				<div id="are-you-sure-text">Are you sure you want to leave?</div>
			</Alert>
		);
	}, []);
	return (
		<ConfirmationModal
			show={true}
			handleClose={() => {
				blocker.reset();
				setShowModal(false);
			}}
			action={() => blocker.proceed()}
			ModalBody={ModalBody}
			ModalTitle={ModalTitle}
		/>
	);
};

/**
 * Button component for adding a song row.
 *
 * @returns {JSX.Element} The add song row button.
 */
const AddSongRowButton = ({ setSongRows, songRows }) => {
	return (
		<Grid item>
			<Button
				key="addSongRow"
				id="add-song-row-btn"
				type="button"
				color="primary"
				variant="outlined"
				size="small"
				startIcon={<AddIcon />}
				onClick={() => setSongRows([songRowsDefault[0], ...songRows])}
			>
				Add Song Row
			</Button>
		</Grid>
	);
};

const songRowsDefault = ["00000000-0000-0000-0000-000000000000"];

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

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationForm);
export { RequiredFields, Songs, SubmitButton, UnsavedChangesModal, AddSongRowButton, SongFields, songRowsDefault };
