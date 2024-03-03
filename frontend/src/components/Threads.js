
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import {refreshAccessToken} from "./tools/Token";

const Threads = () => {
    const navigate = useNavigate();
    const [threads, setThreads] = useState([]);


    const username = localStorage.getItem('username');
    let token = sessionStorage.getItem('token');

    const { data } = useQuery('threads', async () => {
        const response = await axios.post('http://localhost:3000/getThreads', {
            username,
            token,
        });

        return response.data;
    },
        {
            onError: async (error) => {

                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    token = sessionStorage.getItem('token');
                    window.location.reload();
                }
            }
        }

        );

    useEffect(() => {
        if (data) {
            setThreads(data);

        }
    }, [data]);

    const handleThreadClick = (threadId,username) => {
            navigate(`/getThread/${threadId}/${username}`);
    };

    return (
        <div>
            <h2>Threads</h2>
            {threads && threads.length > 0 ? (
                <ul>
                    {threads.map((thread) => (
                        <li key={thread.id}>
                            <strong>ID: {thread.id}, </strong>
                            <strong> Username: {thread.User.username}, </strong>
                            <strong> Creation Date: {thread.creation_date}, </strong>
                            <strong> Last Visit Date: {thread.last_visit_date} </strong>
                            <button onClick={() => handleThreadClick(thread.id,thread.User.username)}>
                                View Thread
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No threads available.</p>
            )}
        </div>
    );
};

export default Threads;
