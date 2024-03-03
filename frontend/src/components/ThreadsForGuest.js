import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './styles/AdminThreads.css';

const ThreadsForGuest = () => {
    const { data: threadsData, isLoading, isError } = useQuery('adminThreads', async () => {
        const response = await axios.post('http://localhost:3000/getThreads');
        return response.data;
    });

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return <p>Error fetching threads</p>;
    }


    return (
        <div className="admin-threads-container">
            <h2>Admin Threads</h2>
            <ul>
                {threadsData.map((thread) => (
                    <li key={thread.id}>
                        <strong> Username: {thread.User.username}</strong>
                        <strong> Creation Date: {thread.creation_date}</strong>
                        <Link to={`/getThread/${thread.id}/guest`} className="link-button">
                            <button>View Messages</button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ThreadsForGuest;
