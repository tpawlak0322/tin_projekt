import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Homepage.css';

const Homepage = () => {
    if (localStorage.getItem("role") == null)
        localStorage.setItem("role", "guest");
    const role = localStorage.getItem("role");

    return (
        <div className="homepage-container">
            <h1>Welcome to the Homepage</h1>
            {role === 'admin' && <AdminHomepage />}
            {role === 'user' && <UserHomepage />}
            {role === 'guest' && <GuestHomepage />}
        </div>
    );
};

const UserHomepage = () => {
    return (
        <div>
            <Link to="/users">
                <button>Go to Users</button>
            </Link>
            <Link to="/threads">
                <button>Go to Threads</button>
            </Link>
            <Link to="/followers">
                <button>Go to Followers</button>
            </Link>
        </div>
    );

};

const GuestHomepage = () => {
    return (
        <div>
            <Link to="/ThreadsForGuest">
                <button>Go to Admin threads</button>
            </Link>
            <div className="guest-text">
                You must be logged in to access more functionalities
            </div>
        </div>
    );
};

const AdminHomepage = () => {
    return (
        <div>
            <Link to="/users">
                <button>Go to Users</button>
            </Link>
            <Link to="/threads">
                <button>Go to Threads</button>
            </Link>
            <Link to="/followers">
                <button>Go to Followers</button>
            </Link>
            <Link to="/ManageAccounts">
                <button>Go to Manage accounts</button>
            </Link>
        </div>
    );
};

export default Homepage;
