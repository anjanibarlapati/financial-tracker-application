import axios from "axios";
import { User } from "../../src/classes/users";

export async function insertUser(user: User) {
    try {
        await axios.post('http://localhost:4321/user', user);
    } catch (error) {
        throw new Error('Failed to insert user');
    }
}

export async function getUsers() {
    try {
        const response = await axios.get('http://localhost:4321/users');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch users');
    }
}

