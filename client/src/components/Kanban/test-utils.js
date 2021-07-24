import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// Import your own reducer
import kanbanReducer from '../../store/kanban';
import userReducer from '../../store/user';

function render(
	ui,
	{
		preloadedState,
		store = configureStore({
			reducer: { kanban: kanbanReducer, user: userReducer },
			preloadedState,
		}),
		...renderOptions
	} = {}
) {
	function Wrapper({ children }) {
		return (
			<Router>
				<Provider store={store}>{children}</Provider>;
			</Router>
		);
	}
	return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}
// re-export everything

export * from '@testing-library/react';

// override render method

export { render };
