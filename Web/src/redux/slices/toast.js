import { createSlice } from "@reduxjs/toolkit";

const toast = createSlice({
	name: "toast",
	initialState: {
		show: false,
		message: "",
		link: "",
		isError: false,
	},
	reducers: {
		setToast: (state, action) => {
			return {
				...state,
				show: action.payload.show,
				message: action.payload.message,
				link: action.payload.link,
				isError: action.payload.isError,
			};
		},
	},
});

export const { setToast } = toast.actions;

export default toast.reducer;
