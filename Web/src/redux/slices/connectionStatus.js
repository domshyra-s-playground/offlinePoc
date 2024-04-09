import { createSlice } from "@reduxjs/toolkit";

// Slice for connection status
const connectionStatus = createSlice({
	name: "connectionStatus",
	initialState: {
		online: true,
		onlineAt: JSON.stringify(new Date()),
		previousOnline: null,
		offlineAt: null,
	},
	reducers: {
		setOnline: (state, _) => {
			return {
				...state,
				online: true,
				previousOnline: state.online,
				onlineAt: JSON.stringify(new Date()),
				onlineAtDisplay: new Date().toLocaleString(),
			};
		},
		setOffline: (state, _) => {
			return {
				...state,
				online: false,
				previousOnline: state.online,
				offlineAt: JSON.stringify(new Date()),
				offlineAtDisplay: new Date().toLocaleString(),
			};
		},
	},
});

export const { setOnline, setOffline } = connectionStatus.actions;

export default connectionStatus.reducer;
