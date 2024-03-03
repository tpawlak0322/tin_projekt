
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './styles/Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            username: event.target.elements.username.value,
            password: event.target.elements.password.value,
        };


        const usernameRegex = /^[a-zA-Z0-9_]+$/;

        if (!usernameRegex.test(formData.username)) {
            setErrorMessage('Invalid username. Use only alphanumeric characters and underscores.');
            return;
        }

        try {
            await axios.post('http://localhost:3000/register', formData);


            navigate('/login');
            console.log('Registration successful');
        } catch (error) {
            console.error('Registration failed:', error.message);
            setErrorMessage('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
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
                <button type="submit">Register</button>
            </form>

            <p className="link-container">
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default Register;
