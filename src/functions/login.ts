import { users } from "../data/users";

export function login(...credentials:string[]){

    if(credentials.length!=2) {
        throw new Error('Provide both username and password') ;
    } 

    const [username, password] = credentials;

    if (!username || !password) {
        throw new Error('Username and password should be non-empty');
     }

    const user = users.find((user)=>user.username === username && user.password === password);

    if(!user){
        throw new Error('Username and password should be valid');
    }

    return user;
}