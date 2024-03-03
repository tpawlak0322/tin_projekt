
import React, { useState } from 'react';
import axios from 'axios';
import { useQueryClient } from 'react-query';
import { useNavigate, Link } from 'react-router-dom';
import './styles/Login.css';

const Login = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            username: event.target.elements.username.value,
            password: event.target.elements.password.value,
        };

        try {
            const response = await axios.post('http://localhost:3000/login', formData);

            const { username, token, refreshToken, role } = response.data;

            localStorage.setItem('username', username);
            sessionStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('role', role);

            queryClient.invalidateQueries('user');

            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);

            if (error.response && error.response.status === 404) {
                setErrorMessage('User not found. Please check your credentials.');
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" name="username" required />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" required />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>

            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}

            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
};

export default Login;
