import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

const AuthContext = React.createContext({
	token: '', // Could use cookie to store this instead
	isLoggedIn: false,
	login: (token) => {},
	logout: () => {},
});

let cookieExpiry;
const timeToExpire = 3600000;
// const timeToExpire = 30000;

export const AuthContextProvider = (props) => {
	// eslint-disable-next-line
	const [cookie, setCookie, removeCookie] = useCookies(['t']);
	const [token, setToken] = useState('');
	const isLoggedIn = !!token;

	const loginHandler = (token) => {
		setToken(token);
		const storageExpire = Number(localStorage.getItem('expire'));
		if (storageExpire !== 0) {
			const timeLeft = storageExpire - new Date().valueOf();
			console.log(timeLeft);
			cookieExpiry = setTimeout(logoutHandler, timeLeft);
			return;
		}

		localStorage.setItem('expire', new Date().valueOf() + timeToExpire);
		cookieExpiry = setTimeout(logoutHandler, timeToExpire);
	};

	const logoutHandler = () => {
		removeCookie('t');
		setToken('');
		localStorage.clear();
		clearTimeout(cookieExpiry);
	};

	const authContext = {
		token: token,
		isLoggedIn: isLoggedIn,
		login: loginHandler,
		logout: logoutHandler,
	};

	return (
		<AuthContext.Provider value={authContext}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
