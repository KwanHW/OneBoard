import { userActions } from './user';

export const login = (userData) => {
	return async () => {
		const loginData = async () => {
			const response = await fetch('/api/signin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error('Invalid email or password.');
			}

			return data;
		};

		try {
			const loginResponse = await loginData();
			return { status: true, data: loginResponse };
		} catch (error) {
			return { status: false, message: error.message };
		}
	};
};

export const register = (userData) => {
	return async () => {
		const registerData = async () => {
			const response = await fetch('/api/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message);
			}
			return data;
		};
		try {
			const registerResponse = await registerData();
			return { status: true, data: registerResponse };
		} catch (error) {
			return { status: false, message: error.message };
		}
	};
};
export const fetchUserData = (id, token) => {
	return async (dispatch) => {
		const fetchData = async () => {
			const response = await fetch(`/api/user/`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Could not fetch user data!');
			}

			const data = await response.json();

			return data;
		};

		try {
			const userData = await fetchData();
			console.log(userData.user.featured);
			dispatch(
				userActions.login({
					id: userData.user._id,
					token,
					firstName: userData.user.firstName,
					lastName: userData.user.lastName,
					email: userData.user.username,
					boards: userData.user.boards,
					featured: userData.user.featured,
				})
			);

			return { isSuccess: true };
		} catch (error) {
			return { isSuccess: false, errorMsg: error.message };
		}
	};
};

export const updateName = (token, userData) => {
	return async (dispatch) => {
		const updateData = async () => {
			const response = await fetch('/api/user', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userData),
			});
			if (!response.ok) {
				throw new Error('Could not change user name!');
			}

			const data = await response.json();

			return data;
		};

		try {
			const updateResponse = await updateData();
			dispatch(userActions.update(userData));
		} catch (error) {}
	};
};

export const updatePassword = (token, userPW) => {
	return async (dispatch) => {
		const updateData = async () => {
			const response = await fetch('/api/user/pass', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userPW),
			});
			if (!response.ok) {
				throw new Error('Could not change user password!');
			}

			const data = await response.json();

			return data;
		};

		try {
			const response = await updateData();
		} catch (error) {}
	};
};
