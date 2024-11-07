import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './styles/index.css';
import App from './App';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Homepage } from './components/Homepage';
import { UserProvider } from './contexts/user';


const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/homepage',
    element: <Homepage />
  },

]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={routes} />
      </UserProvider>
  </React.StrictMode>
);