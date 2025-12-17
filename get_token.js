import axios from 'axios';
import fs from 'fs';

const API_URL = 'http://localhost:3001/api';

async function getToken() {
    try {
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'shridhar@gmail.com',
            password: 'shridhar1234'
        });

        if (loginRes.data.token) {
            console.log('TOKEN:', loginRes.data.token);
            console.log('USER:', JSON.stringify(loginRes.data.user));
            fs.writeFileSync('auth_data.json', JSON.stringify({
                token: loginRes.data.token,
                user: loginRes.data.user
            }, null, 2));
        }
    } catch (error) {
        console.error('Login failed:', error.message);
    }
}

getToken();
