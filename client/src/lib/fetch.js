const generateUpdate = async (token, url, dataReq, method) => {
	const response = await fetch(url, {
		method,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(dataReq),
	});

	if (!response.ok) {
		throw new Error(`Could not process ${method} Request!`);
	}

	const data = await response.json();

	return data;
};

export const getRequest = async (token, url) => {
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Could not process GET Request!');
	}

	const data = await response.json();

	return data;
};

export const postRequest = (token, url, dataReq) => {
	return generateUpdate(token, url, dataReq, 'POST');
};

export const putRequest = (token, url, dataReq) => {
	return generateUpdate(token, url, dataReq, 'PUT');
};

export const deleteRequest = async (token, url) => {
	const response = await fetch(url, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error('Could not process DELETE Request!');
	}

	const data = await response.json();

	return data;
};

export const determineURL = (header, id) => {
	return `${header}/${id}`;
};

export const formatQueryString = (header, start, end) => {
	return `${header}?start=${start}&end=${end}`;
};
