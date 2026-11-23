import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './layouts/Layout/Layout.js';
import './index.css';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Enter from './pages/Enter/Enter.js';
import Favourite from './pages/Favourite/Favourite.js';
import Search from './pages/Search/Search.js';
import SearchError from './pages/SearchError/SearchError.js';
import Description from './pages/Description/Description.js';
import { RequireAuth } from './helpers/RequireAuth.js';
import LoginLayout from './layouts/LoginLayout/LoginLayout.js';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { getMovie } from './api.js';

const router = createHashRouter([
	{
		path: '/auth',
		element: <LoginLayout/>,
		children:
		[
			{
				path: '/auth',
				element: <Enter/>
			},
		]
	},
	{
		path: '/',
		element: <RequireAuth><Layout/></RequireAuth>,
		children: [
			{
				path: '/',
				element: <Enter/>
			},
			{
				path: '/favourite',
				element: <Favourite/>
			},
			{
				path: '/search',
				element: <Search/>,
				errorElement: <SearchError/>,

			},
			{
				path: '/*',
				element: <SearchError/>
			},
			{
				path: '/card/:id',
				element: <Description />,
				errorElement: <>Ошибка</>,
				loader: async ({ params }) => getMovie(String(params.id))
			}
		]
	}
]);


createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
	  </Provider>
	</StrictMode>
);
