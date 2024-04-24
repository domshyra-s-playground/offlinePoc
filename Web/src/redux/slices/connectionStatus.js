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

// Slice for connection status
const connectionStatus = createSlice({
	name: "connectionStatus",
	initialState: {
		online: null,
		onlineAt: null,
		onlineAtDisplay: null,
		previousOnlineAt: null,
		offlineAt: null,
		offlineAtDisplay: null,
	},
	reducers: {
		setOnline: (state, _) => {
			const now = getNewDateForRedux();
			return {
				...state,
				online: true,
				previousOnlineAt: state.onlineAt,
				onlineAt: now.at,
				onlineAtDisplay: now.display,
			};
		},
		setOffline: (state, _) => {
			const now = getNewDateForRedux();
			return {
				...state,
				online: false,
				previousOnlineAt: state.onlineAt,
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
