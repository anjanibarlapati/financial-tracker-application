import axios from "axios";
import { ITransaction } from "../interfaces/transactions";

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
        const response = await axios.get('http://localhost:4321/login/user',{params: {username:username, password:password}});
        return response.data;
    } catch (error) {
        throw new Error('Failed to login user');
    }
}

export async function addTransaction(transaction:ITransaction){
    try {
        const response = await axios.put(`http://localhost:4321/addTransaction/`, transaction);
        return response.data;
    } catch (error) {
        throw new Error('Error while inserting new transaction for the user');
    }
}