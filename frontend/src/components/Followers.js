import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { refreshAccessToken } from "./tools/Token";
import './styles/Followers.css';

const Followers = () => {
    const [followersData, setFollowersData] = useState([]);
    const [expandedUsers, setExpandedUsers] = useState([]);

    const username = localStorage.getItem('username');
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        const fetchFollowersData = async () => {
            try {
                const response = await axios.post('http://localhost:3000/getFollowers', {
                    username: username,
                    token: token,
                });

                if (response.data && response.data.length > 0) {
                    console.log(response.data)
                    setFollowersData(response.data);
                    setExpandedUsers(new Array(response.data.length).fill(false));
                } else {
                    setFollowersData([]);
                    setExpandedUsers([]);
                }
            } catch (error) {
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    window.location.reload();
                }
                console.error('Error fetching followers data:', error);
            }
        };

        fetchFollowersData();
    }, [username, token]);

    const handleExpandClick = (index) => {
        setExpandedUsers((prevExpanded) => {
            const newExpanded = [...prevExpanded];
            newExpanded[index] = !newExpanded[index];
            return newExpanded;
        });
    };

    return (
        <div>
            <h2>Followers</h2>
            {followersData.length > 0 ? (
                <div>
                    {followersData.map((user, index) => (
                        <div key={index}>
                            <button onClick={() => handleExpandClick(index)}>
                                {expandedUsers[index] ? 'Hide' : 'Expand'} Followers of {user.username}
                            </button>
                            {expandedUsers[index] ? (
                                user.followers.length > 0 ? (
                                    <div className="followers-list">
                                        {user.followers.map((follower, followerIndex) => (
                                            <div key={followerIndex} className="followers-list-item">
                                                {follower.username} followed {follower.creation_date}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No followers for {user.username} currently.</p>
                                )
                            ) : null}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No followers currently.</p>
            )}
        </div>
    );
};

export default Followers;
