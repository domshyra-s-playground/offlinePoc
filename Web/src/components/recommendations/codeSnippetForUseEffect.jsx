import { useEffect, useState } from "react";

import { Button } from "@mui/material";

//Here is an example of
const SnipForUseEffectEx = () => {
	const [data, setData] = useState({ value: 0 });

	function increaseData() {
		//setData([...data, data.value + 1])
		setData({ value: data.value + 1 });
	}

	useEffect(() => {
		console.log(data.value);
	}, [data]);

	return (
		<>
			<Button onClick={increaseData}>Increase</Button>
		</>
	);
};

export default SnipForUseEffectEx;
