import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { refreshAccessToken } from "./tools/Token";
import './styles/ManageAccounts.css';

const ManageAccounts = () => {
    const [users, setUsers] = useState([]);
    const [usernameToDelete, setUsernameToDelete] = useState('');
    const username = localStorage.getItem('username');
    let token = sessionStorage.getItem('token');

    const makePostRequest = async (url, data) => {
        try {
            const response = await axios.post(url, data);

            return response.data;
        } catch (error) {
            console.error(`Error in POST request to ${url}:`, error);
            return null;
        }
    };

    const fetchUserData = async () => {
        const data = {
            username,
            token,
        };

        const response = await makePostRequest('http://localhost:3000/getUsers', data);

        if (response) {
            setUsers(response);
        } else {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                token = sessionStorage.getItem('token');
                window.location.reload();
            }
        }
    };

    const deleteUser = async (usernameToDelete) => {
        const data = {
            username,
            token,
            usernameToDelete,
        };

        await makePostRequest('http://localhost:3000/deleteUser', data);


        fetchUserData();
    };

    useEffect(() => {

        fetchUserData();
    }, []);

    return (
        <div className="manage-accounts-container">
            <h2>Manage Accounts</h2>
            <ul className="manage-accounts-list">
                {users.map((user) => (
                    <li key={user.id} className="manage-accounts-item">
                        <span>ID: {user.id}</span>
                        <span>Username: {user.username}</span>
                        <button
                            className="delete-button"
                            onClick={() => deleteUser(user.username)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageAccounts;
