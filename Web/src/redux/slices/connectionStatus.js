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
		online: navigator.onLine,
		onlineAt: navigator.onLine ? initTime.at : null,
		onlineAtDisplay: navigator.onLine ? initTime.display : null,
		previousOnlineAt: null,
		offlineAt: navigator.onLine ? null : initTime.at,
		offlineAtDisplay: navigator.onLine ? null : initTime.display,
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
