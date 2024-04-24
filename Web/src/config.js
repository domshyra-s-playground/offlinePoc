const Config = {
	// baseApiUrl: isProdEnv() ? "https://offlinepocapi.azurewebsites.net/" : "https://localhost:7167/",
	baseApiUrl: "https://localhost:7167/", //TODO! remove this once debugging is done
};

const currencyFormatter = Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});
function isProdEnv() {
	return process.env.NODE_ENV !== "development";
}

export default Config;
export { currencyFormatter, isProdEnv };
