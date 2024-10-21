import "./login.css";
import axios from "axios";
import { useState } from 'react';
import { useLocalStorage } from "../../customhooks/LocalStorage";
import { useNavigate } from "react-router-dom";
import FloatingShapes from "../../components/FloatingShapes";

const postData = (url, data) => axios.post(url, data, { withCredentials: true }).then(res => res).catch(error => console.error(error));

const LoginOrSignUp = ({ setIsAuthenticated, isSignUp, setIsSignUp }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [, setToken] = useLocalStorage('token', '');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		const url = isSignUp ? 'http://localhost:5000/signup' : 'http://localhost:5000/login';
		try {
			postData(url, { username, password }).then(res => {
				const data = res?.data;
				if (data?.token) {
					const expirationTime = new Date().getTime() + 3600 * 1000;
					setToken({ value: data.token, expiration: expirationTime });
					setIsAuthenticated(true);
					navigate(`/home`);
				} else {
					setError('Invalid username or password');
				}
			}).catch(() => {
				setError('Invalid username or password');
			});
		} catch (error) {
			console.error(error);
			setError('An error occurred. Please try again.');
		}
	};

	return (
		<div className="app-wrapper">
			<div className="login-container">
				<h1 className="login-welcome">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
				<form onSubmit={handleSubmit}>
					<div className="input-group">
						<label htmlFor="username">Username</label>
						<input
							type="text"
							id="username"
							value={username}
							autoComplete="off"
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="input-group">
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							value={password}
							autoComplete="off"
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					{error && <div className="error-message">{error}</div>}
					<button type="submit">{isSignUp ? 'Sign Up' : 'Log In'}</button>
				</form>
				<div className="toggle-signup">
					<p className="signup-login-message">{isSignUp ? 'Already have an account?' : 'New user?'}</p>
					<button onClick={() => setIsSignUp(!isSignUp)}>
						{isSignUp ? 'Log In' : 'Sign Up'}
					</button>
				</div>
			</div>
		</div>
	);
};

const LoginPage = ({ setIsAuthenticated }) => {
	const [isSignUp, setIsSignUp] = useState(false);

	return (
		<div className="login-wrapper">
			<FloatingShapes />
			<LoginOrSignUp setIsAuthenticated={setIsAuthenticated} isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
		</div>
	);
};

export default LoginPage