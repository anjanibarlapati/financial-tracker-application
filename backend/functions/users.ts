import axios from "axios";
import { User } from "../../src/classes/users";
import { ITransaction } from "../../src/interfaces/transactions";

export async function insertUser(user: User) {
    try {
        const response = await axios.post('http://localhost:4321/user', user);
        return response.data;
    } catch (error) {
        throw new Error('Failed to insert user');
    }
}

export async function getUsers() {
    try {
        const response = await axios.get('http://localhost:4321/users');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch all users');
    }
}

export async function findUser(username: string, password: string) {
    try {
        const response = await axios.get('http://localhost:4321/user', {
            params: { username: username, password: password }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to find such user');
    }
}

export async function updateBudgetAmountSpent(username:string, category:string, amount:number){
    try {
        const response = await axios.put(`http://localhost:4321/user/budgetamountspent/${username}`, {category:category, amount:amount });
        return response.data;
    } catch (error) {
        throw new Error('Failed to update budget amount spent for the user');
    }
}

export async function addTransaction(username:string, transaction:ITransaction){
    try {
        const response = await axios.put(`http://localhost:4321/user/transaction/${username}`, transaction);
        return response.data;
    } catch (error) {
        throw new Error('Error while inserting new transaction for the user');
    }
}

export async function addIncome(username:string, category:string, amount:number){
    try {
        const response = await axios.put(`http://localhost:4321/user/income/${username}`,{category:category, amount:amount});
        return response.data;
    } catch (error) {
        throw new Error('Error while adding income user');
    } 
}

