import axios from "axios";

export async function registerUser(username:string, password:string) {
    try {
        const response = await axios.post('http://localhost:4321/register/user',{username:username, password:password});
        return response.data;
    } catch (error) {
        throw new Error('Failed to register user');
    }
}

export async function loginUser(username:string, password:string) {
    try {
        const response = await axios.post('http://localhost:4321/login/user',{username:username, password:password});
        return response.data;
    } catch (error) {
        throw new Error('Failed to login user');
    }
}