import { createSlice } from "@reduxjs/toolkit";

//TODO installHook.js:1 A non-serializable value was detected in the state, in the path: `connectionStatus.onlineAt`. Value: Sun Mar 31 2024 21:06:15 GMT-0700 (Pacific Daylight Time) 
// Take a look at the reducer(s) handling this action type: spotifyApi/subscriptions/internal_probeSubscription.
// (See https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state)
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
