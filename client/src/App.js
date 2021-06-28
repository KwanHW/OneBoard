import React, { useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import styles from './App.module.css';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import { Home, EditUser } from './pages';
import ModalContext from './store/ModalContext';
import AuthContext from './store/AuthContext';
import { userActions } from './store/user';
import { kanbanActions } from './store/kanban';
import { fetchUserData } from './store/user-actions';
import { noteActions } from './store/note';
import { eventActions } from './store/event';
// import Expense from './components/Expense/Expense'; <- blanked out for now

function App() {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const id = localStorage.getItem('id') || '';
	const authContext = useContext(AuthContext);
	const modalContext = useContext(ModalContext);
	const isLoggedIn = authContext.isLoggedIn;

	// Only used for persistence
	// Need to check if token is expiring
	useEffect(() => {
		if (token) {
			authContext.login(token);
			dispatch(fetchUserData(id, token));
		}
	}, []);

	useEffect(() => {
		if (!isLoggedIn && !token) {
			dispatch(userActions.logout());
			dispatch(kanbanActions.clear());
			dispatch(noteActions.clear());
			dispatch(eventActions.clear());
			modalContext.hideModal();
			localStorage.clear();
		}
	}, [dispatch, isLoggedIn, token]);

	const showRoutes = (
		<React.Fragment>
			<Route path="/" exact>
				{isLoggedIn ? <Home /> : <Login />}
			</Route>
			<Route path="/register">
				{!isLoggedIn ? <Register /> : <Redirect to="/" />}
			</Route>
			<Route path="/editprofile">
				{isLoggedIn ? <EditUser /> : <Redirect to="/" />}
			</Route>
			{/* <Route path="/expenses"><Expense /></Route> */}
		</React.Fragment>
	);

	return (
		<div className={styles.app}>
			{modalContext.isVisible && modalContext.modal}
			<Router>
				{isLoggedIn && <Switch>{showRoutes}</Switch>}
				{!isLoggedIn && <Switch>{showRoutes}</Switch>}
			</Router>
		</div>
	);
}

export default App;
