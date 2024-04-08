import { setOffline, setOnline } from "../redux/slices/connectionStatus";

import { connect } from "react-redux";
import { useEffect } from "react";

const Offline = ({ children, setOnline, setOffline, status }) => {
	const { online, offlineAt, onlineAt } = status;
	useEffect(() => {
		window.addEventListener("online", setOnline);
		window.addEventListener("offline", setOffline);

		return () => {
			window.removeEventListener("online", setOnline);
			window.removeEventListener("offline", setOffline);
		};
	}, [setOffline, setOnline]);

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
