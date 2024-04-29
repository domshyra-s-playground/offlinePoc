const Config = {
	//TODO! figure out how to test this locally without having to change the baseApiUrl every time....
	baseApiUrl: isProdEnv() ? "https://offlinepocapi.azurewebsites.net/" : "https://localhost:7167/",
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
