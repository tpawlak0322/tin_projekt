import axios from 'axios';
async function refreshAccessToken () {

    const username = localStorage.getItem('username');
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        const response = await axios.post('http://localhost:3000/refresh', {
            username: username,
            refresh_token: refreshToken,
        });

        const tokens = response.data;


        sessionStorage.setItem('token', tokens.token);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('role', tokens.role);

        return true;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
    }
}
export  {refreshAccessToken}