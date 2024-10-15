import mongoose from "mongoose";
import { start } from "../../backend/indexTest";
import { User as UserClass } from "../classes/users";
import { register } from "../functions/registration";
import { ITransaction } from "../interfaces/transactions";
import { Server, IncomingMessage, ServerResponse } from "http";
import { User as UserModel} from "../../backend/models/users";


describe("Transactions Functionality",()=>{
    let server: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;

    let userDocument:any;
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


    test("Should credit given amount when all correct details are provided",async ()=>{

        const txn:ITransaction = {id:user.transactions.length+1, type: "credit", amount:10000, category:"Salary", date:new Date()};
        await user.transaction(txn);

        expect(user.availableBalance).toBe(10000);  
        expect(user.totalIncome).toBe(10000);
    });

    test("Should add credit amount to income if such category exists",async ()=>{
        
        const txn1:ITransaction = {id:user.transactions.length+1, type: "credit", amount:5000, category:"Others", date:new Date()};
        await user.transaction(txn1);
        const txn2:ITransaction = {id:user.transactions.length+1, type: "credit", amount:5000, category:"Others", date:new Date()}
        await user.transaction(txn2);
        expect(user.availableBalance).toBe(20000);  
        expect(user.totalIncome).toBe(20000);
    });

    test("Should debit given amount when all correct details are provided", async ()=>{
        await user.setBudget("Groceries", 2000);

        const txn:ITransaction = {id:user.transactions.length+1, type: "debit", amount:1000, category:"Groceries", date:new Date()}
        await user.transaction(txn);  

        const budget = user.budgets.find(b=>b.category=== txn.category);

        expect(budget?.amountSpent).toBe(1000);
        expect(user.availableBalance).toBe(19000);   
    });

    test("should throw an error when debit amount is more than the available balance", async () => {

        const txn:ITransaction = {id:user.transactions.length+1, type: "debit", amount:100000, category:"Groceries", date:new Date()}
        await expect(user.transaction( txn)).rejects.toThrow("Insufficient balance");
    });

    test("should throw an error when transaction details invalid", async () => {

        const txn1:ITransaction = {id:user.transactions.length+1, type: "debit", amount:-100, category:"Groceries", date:new Date()}
        await expect(user.transaction( txn1)).rejects.toThrow("Transaction amount should greater than zero");

        const txn2:ITransaction = {id:user.transactions.length+1, type: "debit", amount:100, category:"", date:new Date()}
        await expect(user.transaction( txn2)).rejects.toThrow("Transaction category should be non-empty");
    });

    test("should throw an error when budget is insufficient for an existing category", async () => {

        await user.setBudget("Rent", 1000);
        const txn: ITransaction = { id: user.transactions.length + 1, type: "debit", amount: 2000, category: "Rent", date: new Date() };
        await expect(user.transaction(txn)).rejects.toThrow("Insufficient budget for given category");
    });

    test("should allow a debit transaction when the budget category does not exist", async () => {
        const txn: ITransaction = { id: user.transactions.length + 1, type: "debit", amount: 500, category: "Travel", date: new Date() };
        await user.transaction(txn);
        expect(user.availableBalance).toBe(18500); 
    });
    
})
