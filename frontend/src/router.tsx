// ============================================
// ROUTER - React Router Configuration
// ============================================

import { createBrowserRouter } from 'react-router-dom';
import { Home, Timeline, Event, State } from './pages';
import App from './App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'timeline',
        element: <Timeline />,
      },
      {
        path: 'event/:eventId',
        element: <Event />,
      },
      {
        path: 'state',
        element: <State />,
      },
    ],
  },
]);
