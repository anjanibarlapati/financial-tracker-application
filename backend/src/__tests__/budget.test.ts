import { User as UserClass} from "../classes/users";
import { register } from "../functions/registration";
import { ITransaction } from "../interfaces/transactions";
import { Server, IncomingMessage, ServerResponse } from "http";
import { User as UserModel} from "../models/users";
import { start } from "../testServer";
import mongoose from "mongoose";
import { IUser } from "../interfaces/user";

describe("Budget Functionality",()=>{

    let server: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;

    let userDocument:IUser;
    let user:UserClass;
    
    beforeAll(async () => {
        server = await start();
        userDocument = await register("anjani", "anjani123");
        user = new UserClass(userDocument.username, userDocument.password);

    });

    afterAll(async () => {
        await UserModel.deleteMany(); 
        await mongoose.connection.close();
        console.log("Connection closed successfully");
        if(server)
           server.close();
    });

    test("Should add a new budget to budget list",async ()=>{
        const txn1:ITransaction = {id:user.transactions.length+1, type: "credit", amount:1000, category:"Salary", date:new Date()};
        await user.transaction(txn1);

        const txn2:ITransaction = {id:user.transactions.length+1, type: "credit", amount:4000, category:"Others", date:new Date()}
        await user.transaction(txn2);

        await user.setBudget("Groceries", 1000);
        expect(user.totalBudget).toBe(1000);
    })

    test("Should throw an error if budget already exist", async ()=>{
        await expect(user.setBudget("Groceries",1000)).rejects.toThrow("Budget for this category already exists");
    })

    test("Should throw an error if new budget amount is less than zero", async ()=>{
        await expect(user.setBudget("Travel",-1000)).rejects.toThrow("Budget amount should be greater than zero");
        await expect(user.setBudget("Travel", 0)).rejects.toThrow("Budget amount should be greater than zero");
    })

    test("Should update an existing budget for a given category", async () => {
        await user.setBudget("Entertainment", 1000);
        await user.updateBudgetAmount("Entertainment", 1500);
        expect(user.totalBudget).toBe(2500);
    });

    test("Should throw an error when update an existing budget with non-positive amount", async () => {

        await expect(user.updateBudgetAmount("Entertainment", -1000)).rejects.toThrow("Updated budget amount should be greater than zero");
        await expect(user.updateBudgetAmount("Entertainment", 0)).rejects.toThrow("Updated budget amount should be greater than zero");
    });

    test("Should throw an error when updating a budget category that does not exist", async () => {
        
        await expect(user.updateBudgetAmount("other", 1500)).rejects.toThrow("Budget for this category do not exist");
    });

    test("Should return the total amount spent on given category", async ()=>{

        const txn1: ITransaction = { id: user.transactions.length + 1, type: "debit", amount: 200, category: "Groceries", date: new Date() };
        await user.transaction(txn1);

        const txn2: ITransaction = { id: user.transactions.length + 1, type: "debit", amount: 500, category: "Groceries", date: new Date() };
        await user.transaction(txn2);

        const amountSpent = user.checkBudgetSpent("Groceries");
        expect(amountSpent).toBe(700);
    })

    test("Should throw an error when checking amount spent on a budget category that do not exist",()=>{
       
        expect(()=>user.checkBudgetSpent("Travel")).toThrow("Budget for this category do not exist");
    })

    test("Should throw an error when adding budget category exceeds available balance",async ()=>{
        
        await expect(user.setBudget("Rent", 20000)).rejects.toThrow("Adding this budget will exceeds the available balance");
    })

    test("Should throw an error when updating budget category exceeds available balance", async ()=>{
        
        await expect(user.updateBudgetAmount("Groceries", 20000)).rejects.toThrow("Updating this budget will exceeds the available balance");
    })
})