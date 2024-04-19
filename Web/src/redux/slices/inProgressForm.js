import { createSlice } from "@reduxjs/toolkit";

const inProgressForm = createSlice({
	name: "inProgressForm",
	initialState: {
		inProgress: true,
		form: {},
		formType: "recommendation",
		timeStamp: null,
	},
	reducers: {
		setInProgressForm: (_, action) => {
			return {
				form: action.payload.form,
				inProgress: true,
				formType: action.payload.formType ?? "recommendation",
				timeStamp: new Date().getTime(),
			};
		},
		clearInProgressForm: (_, action) => {
			return {
				form: {},
				inProgress: false,
				formType: action.payload.formType ?? "recommendation",
			};
		},
	},
	extraReducers: (builder) => {
		builder.addDefaultCase((state) => {
			return state;
		});
	},
});

export const { setInProgressForm, clearInProgressForm } = inProgressForm.actions;

export default inProgressForm.reducer;
