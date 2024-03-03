
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/logout');
    };

    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/" className="home-link">Home</Link>
                </li>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {role === 'guest' ? (
                        <>
                            <li>
                                <Link to="/login" className="login-button">Login</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <div className="user-info">Currently logged in as: {username}</div>
                            <li>
                                <button onClick={handleLogout} className="logout-button">Logout</button>
                            </li>
                        </>
                    )}
                </div>
            </ul>
        </nav>
    );
};

export default Navbar;
