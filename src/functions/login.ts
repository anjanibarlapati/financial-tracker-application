import { users } from "../data/users";

export function login(...credentials:string[]){

    const [username, password] = credentials;

    const user = users.find((user)=>user.username === username && user.password === password);

    if(!user){
        throw new Error('Username and password should be valid');
    }
    
    return user;
}