import { useEffect, useRef } from "react";

import isDeepEqual from "fast-deep-equal/react";

//In react 19 we might have accesss to isSubmitting hook
/**
 *
 * @param {object} methods
 * @param {string} formType
 * @param {object {set : func, clear: func}} reduxFunctions
 */
export default function useInProgressForm(methods, formType, reduxFunctions) {
	const { clear, set } = reduxFunctions;
	const formState = methods.formState;
	const ref = useRef(methods.getValues());

	if (!isDeepEqual(ref.current, methods.watch())) {
		ref.current = methods.getValues();
	}

	useEffect(() => {
		if (formState.isSubmitSuccessful) {
			clear({ formType });
		}
	}, [clear, formState.isSubmitSuccessful, formType]);
	useEffect(() => {
		if (ref.current) {
			set({ formType, form: ref.current });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formType, set, ref.current]);
}
