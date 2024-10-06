import axios from "axios";
import { User } from "../../src/classes/users";

export async function insertUser(user: User) {
    try {
        await axios.post('http://localhost:4321/user', user);
    } catch (error) {
        throw new Error('Failed to insert user');
    }
}

