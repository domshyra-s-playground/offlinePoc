import { FormHelperText } from "@mui/material";
import React from "react";
import { connect } from "react-redux";

const OfflineDataHelper = ({ online }) => {
	if (online) {
		return null;
	}
	return (
		<FormHelperText sx={{ textAlign: "left" }} pb={0}>
			You are offline, some data might be out of date.
		</FormHelperText>
	);
};

function mapStateToProps(state) {
	return {
		online: state.connectionStatus.online,
	};
}

export default connect(mapStateToProps)(OfflineDataHelper);
