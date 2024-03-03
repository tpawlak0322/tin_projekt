import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, queryCache } from 'react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { refreshAccessToken } from "./tools/Token";
import './styles/ThreadsMessages.css';


let maxMessageLength = 1;
const ThreadMessages = () => {
    const { id: threadId, username: threadUsername } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 5;

    const username = localStorage.getItem('username');
    let token = sessionStorage.getItem('token');

    const { data } = useQuery(['threadMessages', threadId, currentPage], async () => {
        const response = await axios.post('http://localhost:3000/getThread/Messages', {
            username,
            token,
            thread_id: threadId,
            page: currentPage,
            messagesPerPage,
        });
        console.log(response.data)
        if(response.data.totalMessagesCount > maxMessageLength) {
            maxMessageLength = response.data.totalMessagesCount;
            setCurrentPage(Math.ceil(maxMessageLength/messagesPerPage))
        }
        return response.data.messages;
    }, {
        onError: async (error) => {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                token = sessionStorage.getItem('token');
                window.location.reload();
            }
        }
    });

    const createMessageMutation = useMutation(
        (messageText) =>
            axios.post('http://localhost:3000/getThread/Messages/create', {
                username,
                token,
                thread_id: threadId,
                message: messageText,
            }),
        {
            onSuccess: async () => {
                window.location.reload();
            },
            onError: async (error) => {
                const refreshed = await refreshAccessToken();
                if (refreshed) {
                    token = sessionStorage.getItem('token');
                    await handleSendMessage();
                }
            }
        }
    );

    useEffect(() => {
        if (data) {

            setMessages(data);
        }
    }, [data]);

    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
            try {
                createMessageMutation.mutate(newMessage);
                setNewMessage('');
            } catch (e) {
                console.error('Error sending message:', e);
                const refreshed = await refreshAccessToken();
            }
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="thread-container">
            <h2>Thread Messages</h2>
            {messages && messages.length > 0 ? (
                <div>
                    <ul className="message-list">
                        {messages.map((message) => (
                            <MessageItem
                                key={message.id}
                                message={message}
                                username={username}
                                token={token}
                                threadUsername = {threadUsername}
                            />
                        ))}
                    </ul>
                    <div className="pagination">
                        {Array.from({ length: Math.ceil((maxMessageLength) / messagesPerPage) }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={currentPage === i + 1 ? 'active' : ''}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <p>No messages in this thread.</p>
            )}

            {username == threadUsername ? (<div>
                <textarea
                    className="message-input"
                    rows="3"
                    cols="30"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="send-message-button" onClick={handleSendMessage}>Send Message</button>
            </div>) : (<div></div>)}
        </div>
    );
};
const MessageItem = ({ message, username, token, threadUsername }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(message.text);

    const handleEditMessage = async () => {
        try {
            await axios.post('http://localhost:3000/editMessage', {
                username,
                token,
                message_id: message.id,
                editedMessage,
            });

            setIsEditing(false);
            window.location.reload()
            await queryCache.invalidateQueries(['threadMessages', message.thread_id]);
        } catch (error) {
            console.error('Error editing message:', error);
            const refreshed = await refreshAccessToken();

        }
    };
    return (
        <li className="message-item">
            {isEditing ? (
                <div className="edit-message-container">
                    <input
                        className="edit-message-input"
                        type="text"
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                    />
                    <button className="send-message-button" onClick={handleEditMessage}>Send</button>
                </div>
            ) : (
                <button className="send-message-button" onClick={() => {
                    if(username === threadUsername)
                        setIsEditing(true)
                }}>{message.text}</button>
            )}
        </li>
    );

};

export default ThreadMessages;
