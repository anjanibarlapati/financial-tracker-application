import { User } from "../classes/users";
import { users } from "../data/users";

export function register(...credentials:string[]){
    const [username, password] = credentials;
    if (!username || !password) {
        throw new Error('Username and password should be non-empty');
    }
    const user = new User(username, password);
    users.push(user);
    return user;
}