import { PURGE } from "redux-persist";
import { createSlice } from "@reduxjs/toolkit";

/**
 * 
 * @returns {Object} - Object containing the current date and time in JSON and display format
 */
const getNewDateForRedux = () => {
	const now = new Date();

	return {
		at: JSON.stringify(now),
		display: now.toLocaleString(),
	};
};
const initTime = getNewDateForRedux();

// Slice for connection status
const connectionStatus = createSlice({
	name: "connectionStatus",
	initialState: {
		online: false,
		onlineAt: null,
		previousOnline: null,
		offlineAt: initTime.at,
		offlineAtDisplay: initTime.display,
	},
	reducers: {
		setOnline: (state, _) => {
			const now = getNewDateForRedux();
			return {
				...state,
				online: true,
				previousOnline: state.online,
				onlineAt: now.at,
				onlineAtDisplay: now.display,
			};
		},
		setOffline: (state, _) => {
			const now = getNewDateForRedux();
			return {
				...state,
				online: false,
				previousOnline: state.online,
				offlineAt: now.at,
				offlineAtDisplay: now.display,
			};
		},
	},
	extraReducers: (builder) => {
		builder.addCase(PURGE, (state) => {
			//TODO: implement customEntityAdapter
			// customEntityAdapter.removeAll(state);
		});
	},
});



export const { setOnline, setOffline } = connectionStatus.actions;

export default connectionStatus.reducer;
