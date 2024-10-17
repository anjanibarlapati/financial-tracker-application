import axios from "axios";
import { User } from "../../src/classes/users";
import { ITransaction } from "../../src/interfaces/transactions";
import { ISavingsGoal } from "../../src/interfaces/savingsGoals";

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

export async function isExistingUser(username: string) {
    try {
        const response = await axios.get(`http://localhost:4321/user/${username}`);
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
        throw new Error('Error while adding income to the user');
    } 
}

    
export async function updateIncomeAmount(username:string, category:string, amount:number){
    try {
        const response = await axios.put(`http://localhost:4321/user/incomeamount/${username}`,{category:category, amount:amount});
        return response.data;
    } catch (error) {
        throw new Error('Error while updating income to the user');
    } 
}

export async function debitAmount(username:string, amount:number){
    try {
        const response = await axios.put(`http://localhost:4321/user/transaction/debit/${username}`, {amount:amount});
        return response.data;
    } catch (error) {
        throw new Error('Error while updating user');
    }
}

export async function addBudget(username:string, category:string, amount:number){
    try {
        const response = await axios.put(`http://localhost:4321/user/budget/${username}`,{category:category, amount:amount});
        return response.data;
    } catch (error) {
        throw new Error('Error while inserting new budget to the user');
    } 
}

export async function updateBudgetAmount(username:string, category:string, amount:number, totalBudget:number){
    try {
        const response = await axios.put(`http://localhost:4321/user/updatebudgetamount/${username}`,{category:category, amount:amount, totalBudget:totalBudget});
        return response.data;
    } catch (error) {
        throw new Error('Error while updating user budget amount');
    } 
}

export async function addSavingsGoal(username:string, savingsGoal:ISavingsGoal){
    try {
        const response = await axios.put(`http://localhost:4321/user/savingsgoal/${username}`,savingsGoal);
        return response.data;
    } catch (error) {
        throw new Error('Error while adding savings goal to the user');
    } 
}

    
export async function addAmountToASavingsGoal(username:string, title:string, amount:number){
    try {
        const response = await axios.put(`http://localhost:4321/user/savingsgoalamount/${username}`,{title:title, amount:amount});
        return response.data;
    } catch (error) {
        throw new Error('Error while adding amount to savings goal of the user');
    } 
}



