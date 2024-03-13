import { Box, Button, Grid, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetRecommendationQuery, useUpsertRecommendationMutation } from "../../redux/services/playlistRecommendationApi";
import { useNavigate, useParams } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import { DevTool } from "@hookform/devtools";
import GenericTextItem from "../subcomponets/GenericTextItem";
import { LoadingButton } from "@mui/lab";
import RemoveIcon from "@mui/icons-material/Remove";

const RecommendationForm = () => {
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
	const [upsertRecommendation] = useUpsertRecommendationMutation();

	useEffect(() => {
		if (data) {
			methods.reset(data, { keepIsValid: false });
			setSongRows(data?.suggestions?.length ?? 0);
		}
	}, [methods.reset, data, methods]);

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
					navigate("/recommendations");
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {
					setShowLoadingButton(false);
				});
		},
		[upsertRecommendation, isCreateMode, navigate]
	);

	const songs = useMemo(() => {
		const songRow = (index) => {
			return (
				<Grid container direction="row" spacing={2} key={index}>
					<Grid item>
						<GenericTextItem
							name={`suggestions[${index}].title`}
							label="Title"
							id={`suggestions[${index}].title`}
							customControl={methods.control}
							fullWidth
						/>
					</Grid>
					<Grid item>
						<GenericTextItem
							name={`suggestions[${index}].artist`}
							label="Artist"
							id={`suggestions[${index}].artist`}
							customControl={methods.control}
							fullWidth
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
	}, [methods.control, songRows]);

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

	return (
		<FormProvider key="fireStationForm" {...methods}>
			<Typography variant="h5" gutterBottom id="fireStation-title">
				{isCreateMode ? "Create" : "Edit"} Recommendation
			</Typography>
			<Box key="bcegsFormBox" component="form" noValidate autoComplete="off" onSubmit={methods.handleSubmit(onFormSubmit)}>
				<Grid container direction="row" spacing={2}>
					<Grid item>
						<GenericTextItem
							name="name"
							label="Name"
							id="name"
							rules={{ required: "Name is required." }}
							customControl={methods.control}
							isLoading={isLoading}
						/>
					</Grid>
				</Grid>
				<Grid container direction="row" spacing={2}>
					<Grid item>
						<GenericTextItem
							name="description"
							label="Description"
							id="description"
							customControl={methods.control}
							isLoading={isLoading}
							multiline
						/>
					</Grid>
				</Grid>
				<Typography variant="h6" gutterBottom id="fireStation-title">
					Songs
				</Typography>
				<Grid container direction="row" justifyContent={"center"} spacing={2}>
					{addSongRowButton}
					{removeSongRowButton}
				</Grid>
				<Grid container direction="row" pt={4} px={2}>
					{songs}
				</Grid>
				<Grid container direction="row">
					<Grid item>
						<Box mt={0} pt={2} pb={2}>
							<LoadingButton
								key="bcegsSubmit"
								id="submit-form-btn"
								type="submit"
								color="primary"
								variant="contained"
								loading={showLoadingButton}
								disabled={!isDirty || !isValid}
							>
								{isCreateMode ? "Create" : "Save"}
							</LoadingButton>
						</Box>
					</Grid>
				</Grid>
				<DevTool control={methods.control} />
			</Box>
		</FormProvider>
	);
};

export default RecommendationForm;
