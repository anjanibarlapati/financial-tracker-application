import { findUser } from "../services/usersApis";

export async function login(...credentials:string[]){

    if(credentials.length!=2) {
        throw new Error('Provide both username and password') ;
    } 

    const [username, password] = credentials;

    if (!username || !password) {
        throw new Error('Username and password should be non-empty');
     }

    const user = await findUser(username, password);
    if(!user){
        throw new Error('Username and password should be valid');
    }

    return user;
}