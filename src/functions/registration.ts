import { User } from "../classes/users";
import { users } from "../data/users";

export function register(...credentials:string[]){
    const [username, password] = credentials;

    const user = new User(username, password);
    users.push(user);
    return user;
}