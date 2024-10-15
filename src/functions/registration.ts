import { getUsers, insertUser, isExistingUser } from "../../backend/functions/usersApis";
import { getUser } from "../../backend/functions/usersRoutesHandler";
import { User } from "../classes/users";
import { users } from "../data/users";

export async function register(...credentials:string[]){

    const [username, password] = credentials;

    if(credentials.length!=2) {
        throw new Error('Provide both username and password') ;
    } 

    if (!username || !password) {
        throw new Error('Username and password should be non-empty');
    }

    const existingUser = await isExistingUser(username);
    if (existingUser) {
        throw new Error('Username is already exist');
    };
    
    const user = new User(username, password);
    const newUser = await insertUser(user);
    return newUser;
}