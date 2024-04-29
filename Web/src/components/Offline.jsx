import { setOffline, setOnline } from "../redux/slices/connectionStatus";

import { connect } from "react-redux";
import { useEffect } from "react";

const Offline = ({ children, setOnline, setOffline, status }) => {
	const { online, offlineAt, onlineAt } = status;

	//Add event listeners for online and offline events
	useEffect(() => {
		window.addEventListener("online", setOnline);
		window.addEventListener("offline", setOffline);

		return () => {
			window.removeEventListener("online", setOnline);
			window.removeEventListener("offline", setOffline);
		};
	}, [setOffline, setOnline]);

	//Only check for online status on initial load
	useEffect(() => {
		if (navigator.onLine) {
			fetch("https://jsonplaceholder.typicode.com/todos/1")
				.then(() => {
					setOnline();
				})
				.catch(() => {
					setOffline();
				});
		} else {
			setOffline();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//Log the online status and the time of the last online and offline events
	useEffect(() => {
		console.log(
			`Online: ${online} Offline at: ${new Date(JSON.parse(offlineAt)).toLocaleString()} Online at: ${new Date(
				JSON.parse(onlineAt)
			).toLocaleString()}`
		);
	}, [online, offlineAt, onlineAt]);

	return <>{children}</>;
};

function mapStateToProps(state) {
	return {
		status: state.connectionStatus,
	};
}

const mapDispatchToProps = {
	setOffline,
	setOnline,
};

export default connect(mapStateToProps, mapDispatchToProps)(Offline);
