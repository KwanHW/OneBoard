import styles from './App.module.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Sidebar from './UI/Sidebar';
import Home from './pages/Home';
import Products from './pages/Products';
import Reports from './pages/Reports';
import Login from './components/Login/Login';
import Register from './components/Login/Register';

function App() {
	return (
    //  <Register />
    // <Login />
		<div className="App">
			<Router>
				{/* <Sidebar /> */}
				<Switch>
					<Route path="/" exact component={Login} />
					<Route path="/register" component={Register} />
					{/* <Route path="/" exact component={Home} />
					<Route path="/reports" component={Reports} />
					<Route path="/products" component={Products} /> */}
				</Switch>
			</Router>
		</div>
	);
}

export default App;
