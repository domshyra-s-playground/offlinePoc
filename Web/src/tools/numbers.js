/**
 * Tests where a value is a number or empty string.
 * @param {string|number} value
 * @returns
 */
export const isSafeNumberValue = (value) => {
	let newValue = Number(value);
	if (!isNaN(newValue) || value === "") {
		return true;
	}
	return false;
};

/**
 * Takes a textFieldValue and returns a valid number as Int or zero
 * @param {string|number} textFieldValue any js value
 * @returns zero or value as int
 */
export const getSafeNumber = (textFieldValue) => {
	return isSafeNumberValue(textFieldValue) ? Math.trunc(Number(textFieldValue)) : 0;
};

/**
 * Returns a valid decimal as a number or zero;
 * @param {string|number} textFieldValue
 * @returns {number|number}
 */
export const getSafeDecimal = (textFieldValue) => {
	return isSafeNumberValue(textFieldValue) ? Number(textFieldValue) : 0;
};

/**
 * Returns a string value with 2 decimal places by default
 * @param {Number} value
 * @param {Int} places
 * @returns
 */
export const truncateDecimal = (value, places = 2) => {
	if (isNaN(parseFloat(value))) {
		return "";
	}
	return parseFloat(parseFloat(value).toFixed(places));
};

/**
 * Rounds values and returns the truncate
 * @param {*} value
 * @param {*} places
 * @returns
 */
export const roundToDecimalPlaces = (value, places) => (Math.round(value * 100) / 100).toFixed(places);
