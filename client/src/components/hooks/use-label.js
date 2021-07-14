import { useState } from 'react';

export default function useLabel(initLabel) {
	const [labels, setLabels] = useState(initLabel);

	const editLabels = (e, index) => {
		const name = e.target.value;
		if (name.trim() === labels[index]) return;
		const newLabel = { ...labels[index], name: name };
		const newLabels = [...labels];
		newLabels.splice(index, 1, newLabel);
		setLabels(newLabels);
	};

	return {
		labels,
		editLabels,
	};
}
