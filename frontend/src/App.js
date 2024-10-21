import './App.css';
import Home from './pages/home/Home.jsx';
import LoginPage from './pages/login/LoginPage.jsx';
import NotFound from './pages/notFound/NotFound.jsx';

import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useLocalStorage } from "./customhooks/LocalStorage.js";
import { useState, useEffect } from 'react';
import { Route, createRoutesFromElements, createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setToken] = useLocalStorage('token', '');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedToken = JSON.parse(localStorage.getItem('token'));
      if (storedToken && storedToken.value) {
        const currentTime = new Date().getTime();
        if (currentTime > storedToken.expiration) {
          refreshAuthToken(storedToken.refreshToken);
        } else {
          try {
            const decodedToken = jwtDecode(storedToken.value);
            setIsAuthenticated(true);
            setUserId(decodedToken.user_id);
            setLoading(false);
          } catch (error) {
            console.error('Invalid token:', error);
            setIsAuthenticated(false);
            setLoading(false);
          }
        }
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    const refreshAuthToken = async (refreshToken) => {
      try {
        const res = await axios.post('http://localhost:5000/token', {}, { withCredentials: true });
        console.log('Refresh Response:', res.data);
        const data = res.data;
        if (data && data.token) {
          try {
            const decodedToken = jwtDecode(data.token);
            const expirationTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now
            const newToken = { value: data.token, refreshToken: refreshToken, expiration: expirationTime };
            localStorage.setItem('token', JSON.stringify(newToken));
            console.log("Token refreshed:", newToken);
            setIsAuthenticated(true);
            setUserId(decodedToken.user_id);
            setLoading(false);
          } catch (error) {
            console.error('Invalid token:', error);
            setIsAuthenticated(false);
            setLoading(false);
          }
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };


    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [setIsAuthenticated, setToken]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/login" element={!isAuthenticated ? <LoginPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to={"/home"} />} />
        <Route path="/home" element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} setToken={setToken} userId={userId} loading={loading} /> : <Navigate to={"/login"} />} />

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
