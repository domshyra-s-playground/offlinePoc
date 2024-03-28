import { createSlice } from "@reduxjs/toolkit";

const connectionStatus = createSlice({
	name: "connectionStatus",
	initialState: {
		online: true,
		onlineAt: new Date().toLocaleString(),
		previousOnline: null,
		offlineAt: null,
	},
	reducers: {
		setOnline: (state, _) => {
			return {
				...state,
				online: true,
				previousOnline: state.online,
				onlineAt: new Date(),
				onlineAtDisplay: new Date().toLocaleString(),
			};
		},
		setOffline: (state, _) => {
			return {
				...state,
				online: false,
				previousOnline: state.online,
				offlineAt: new Date(),
				offlineAtDisplay: new Date().toLocaleString(),
			};
		},
	},
});

export const { setOnline, setOffline } = connectionStatus.actions;

export default connectionStatus.reducer;
