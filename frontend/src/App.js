import './App.css';
import Home from './pages/home/Home.jsx';
import LoginPage from './pages/login/LoginPage.jsx';
import NotFound from './pages/notFound/NotFound.jsx';

import { useLocalStorage } from "./customhooks/LocalStorage.js";
import { useState } from 'react';
import { Route, createRoutesFromElements, createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [_, setToken] = useLocalStorage('token', '');

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/home" element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} setToken={setToken} /> : <Navigate to={"/login"} />} />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={isAuthenticated ? <NotFound /> : <Navigate to="/login" />} />
      </Route>
    )
  );

  return (
    <div className='app'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;
