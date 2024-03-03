import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { refreshAccessToken } from './tools/Token';
import './styles/UsersFollowed.css';


const UsersFollowed = () => {
    const navigate = useNavigate();
    const [followingUsers, setFollowingUsers] = useState([]);
    const [notFollowingUsers, setNotFollowingUsers] = useState([]);

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

    const fetchFollowedData = async () => {
        try {
            const response = await axios.post('http://localhost:3000/getUsersFollowed', {
                username,
                token,
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching followed users data:', error);
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                token = sessionStorage.getItem('token');
                window.location.reload();
            }
            return [];
        }
    };

    const fetchNotFollowedData = async () => {
        try {
            const response = await axios.post('http://localhost:3000/getUsersNotFollowed', {
                username,
                token,
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching not followed users data:', error);
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                token = sessionStorage.getItem('token');
                window.location.reload();
            }
            return [];
        }
    };

    const handleFollowClick = async (userIdToFollow) => {
        try {
            await axios.post(`http://localhost:3000/addFollower/${userIdToFollow}`, {
                username,
                token,
            });
            window.location.reload();
        } catch (error) {
            console.error('Error following user:', error);
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                token = sessionStorage.getItem('token');
                handleFollowClick(userIdToFollow);
            }
        }
    };

    const handleUnfollowClick = async (userIdToUnfollow) => {
        try {
            await makePostRequest(`http://localhost:3000/unfollow/${userIdToUnfollow}`, {
                username,
                token,
            });
            window.location.reload();
        } catch (error) {
            console.error('Error unfollowing user:', error);
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                token = sessionStorage.getItem('token');
                handleUnfollowClick(userIdToUnfollow);
            }
        }
    };

    const { data: followedData } = useQuery('followedUsers', fetchFollowedData);

    const { data: notFollowedData } = useQuery('notFollowedUsers', fetchNotFollowedData);

    useEffect(() => {
        if (followedData) {
            setFollowingUsers(followedData);
        }

        if (notFollowedData) {
            setNotFollowingUsers(notFollowedData);
        }
    }, [followedData, notFollowedData]);

    return (
        <div className="users-followed-container">
            <h2>Users</h2>
            <div>
                <h3>Following</h3>
                {followingUsers && followingUsers.length > 0 ? (
                    <ul className="following-list">
                        {followingUsers.map((user) => (
                            <li key={user.id} className="following-item">
                                <span className="item-text">ID: {user.id}, Username: {user.username}</span>
                                <button className="unfollow-button" onClick={() => handleUnfollowClick(user.id)}>Unfollow</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You are not following any users.</p>
                )}
            </div>
            <div>
                <h3>Not Following</h3>
                {notFollowingUsers && notFollowingUsers.length > 0 ? (
                    <ul className="not-following-list">
                        {notFollowingUsers.map((user) => (
                            <li key={user.id} className="not-following-item">
                                <span className="item-text">ID: {user.id}, Username: {user.username}</span>
                                <button className="follow-button" onClick={() => handleFollowClick(user.id)}>Follow</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>All users are being followed.</p>
                )}
            </div>
        </div>
    );
};

export default UsersFollowed;
