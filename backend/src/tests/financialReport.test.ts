import { User as UserClass } from "../classes/users";
import { register } from "../functions/registration";
import { IFinancialReport, IFinancialReportBudget, IFinancialReportSavingsGoal } from "../interfaces/financialReport";
import { ITransaction } from "../interfaces/transactions";
import { User as UserModel} from "../../backend/models/users";
import { Server, IncomingMessage, ServerResponse } from "http";
import mongoose from "mongoose";
import { start } from "../../backend/testIndex";
import { IUser } from "../interfaces/user";

describe("Financial Report Functionality",()=>{

    let server: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;

    let userDocument:IUser;
    let user:UserClass;
    
    beforeAll(async () => {
        server = await start();
        userDocument = await register("anjani", "anjani123");
        user = new UserClass(userDocument.username, userDocument.password);

        const transactions:ITransaction[] = [
            {    id:1, type: 'credit', amount: 10000, category: "Rental Salary", date:new Date("2024-09-05")},
            {    id:2, type: 'debit', amount: 480, category: "Other", date:new Date("2024-09-06")},
            {    id:3, type: 'debit', amount: 350, category: "Travel", date:new Date("2024-09-06")},
            {    id:4, type: 'debit', amount: 123, category: "Other", date:new Date("2024-09-07")},
            {    id:5, type: 'debit', amount: 1300, category: "Groceries", date:new Date("2024-09-07")},
            {    id:6, type: 'debit', amount: 700, category: "Entertainment", date:new Date("2024-09-08")},
            {    id:7, type: 'debit', amount: 2500, category: "Groceries", date:new Date("2024-09-09")},
            {    id:8, type: 'credit', amount: 5000, category: "Business", date:new Date("2024-09-10")},
            {    id:9, type: 'debit', amount: 240, category: "Other", date:new Date("2024-09-11")},
            {    id:10, type: 'credit', amount: 10000, category: "Salary", date:new Date("2024-09-15")},
            {    id:11, type: 'debit', amount: 130, category: "Other", date:new Date("2024-09-20")},
            {    id:12, type: 'credit', amount: 500, category: "Other", date:new Date("2024-09-20")},
            {    id:13, type: 'debit', amount: 300, category: "Entertainment", date:new Date("2024-09-21")},
            {    id:14, type: 'debit', amount: 450, category: "Travel", date:new Date("2024-09-22")},                
            {    id:15, type: 'debit', amount: 1200, category: "Groceries", date:new Date("2024-09-23")},
            {    id:16, type: 'debit', amount: 432, category: "Other", date:new Date("2024-09-25")},
            {    id:17, type: 'credit', amount: 600, category: "Other", date:new Date("2024-09-25")},
            {    id:18, type: 'credit', amount: 200, category: "Other", date:new Date("2024-09-26")},
            {    id:19, type: 'debit', amount: 220, category: "Other", date:new Date("2024-09-26")},
        ]   
    
        const budgets = [
            {category: "Travel", amount:1000, amountSpent:0},
            {category: "Groceries", amount:10000, amountSpent:0},
            {category: "Entertainment", amount:5000, amountSpent:0},

        ]
        const savings = [
            {title: "Travel", targetAmount:2000, currentAmountSaved:1500},
            {title: "Home", targetAmount:5000, currentAmountSaved:3800},
            {title: "Emergency Fund", targetAmount:1000, currentAmountSaved:700}
        ]
        await user.transaction({id:20, type: 'credit', amount: 30000, category: "Interest Income", date:new Date("2024-09-05")});

        for (const budget of budgets) {
            await user.setBudget(budget.category, budget.amount);
        }
        for (const transaction of transactions) {
            await user.transaction(transaction);
        }
        for (const saving of savings) {
            await user.addSavingsGoal(saving);
        }

    });

    afterAll(async () => {
        await UserModel.deleteMany(); 
        await mongoose.connection.close();
        console.log("Connection closed successfully");
        if(server)
           server.close();
    });

    test("Should return total income and expenses financial report of a user",()=>{

        const report1:IFinancialReport = {
            totalIncome: 55000,
            totalExpenses: 5693,
        }
        const report2:IFinancialReport = {
            totalIncome: 1300,
            totalExpenses: 2732,
        }    
        const report3:IFinancialReport = {
            totalIncome: 0,
            totalExpenses: 0,
        }
        expect(user.totalIncomeAndExpenses(new Date("2024-09-05"), new Date("2024-09-15"))).toEqual(report1);
        expect(user.totalIncomeAndExpenses(new Date("2024-09-20"), new Date("2024-09-26"))).toEqual(report2);
        expect(user.totalIncomeAndExpenses(new Date("2024-09-01"), new Date("2024-09-04"))).toEqual(report3);


    })

    test("Should throw an error when give period is invalid",()=>{
        expect(()=>user.totalIncomeAndExpenses(new Date("2024-09-20"), new Date("2024-09-08"))).toThrow("Invalid period");
     })
    
    test("Should return summary of budget usage across different categories", ()=>{

        const report:IFinancialReportBudget[] = [
                { category: 'Travel', amountSpent: 800 },
                { category: 'Groceries', amountSpent: 5000 },
                { category: 'Entertainment', amountSpent: 1000 }
        ]
        expect(user.budgetSummary()).toEqual(report);

    })

    test("Should return progress towards savings goals", ()=>{

        const report:IFinancialReportSavingsGoal[] = [
            { title: 'Travel', progress: '75%' },
            { title: 'Home', progress: '76%' },
            { title: 'Emergency Fund', progress: '70%' }
        ]
        expect(user.savingsGoalsProgress()).toEqual(report);

    })


})

