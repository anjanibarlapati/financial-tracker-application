import { User } from "../classes/users";
import { users } from "../data/users";

export function register(...credentials:string[]){

    const [username, password] = credentials;

    if(credentials.length!=2) {
        throw new Error('Provide both username and password') ;
    } 

    if (!username || !password) {
        throw new Error('Username and password should be non-empty');
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        throw new Error('Username is already exist');
    };
    
    const user = new User(username, password);
    users.push(user);
    return user;
}