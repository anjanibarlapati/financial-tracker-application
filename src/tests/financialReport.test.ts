import { User } from "../classes/users";
import { register } from "../functions/registration";
import { IFinancialReport } from "../interfaces/financialReport";
import { ITransaction } from "../interfaces/transactions";

describe("Financial Report Functionality",()=>{

    let user:User;
    
    beforeAll(()=>{
        user = register("anjani", "anjani123");
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
        user.transaction({id:20, type: 'credit', amount: 30000, category: "Interest Income", date:new Date("2024-09-05")});
        budgets.forEach(b=>user.setBudget(b.category, b.amount));
        transactions.forEach(t=>user.transaction(t));
        savings.forEach(s=>user.addSavingsGoal(s));
    })


    test("Should return the financial report of given user",()=>{

        const report1:IFinancialReport = {
            totalIncome: 55000,
            totalExpenses: 5693,
            budgets: [
                { category: 'Travel', amountSpent: 350 },
                { category: 'Groceries', amountSpent: 3800 },
                { category: 'Entertainment', amountSpent: 700 }
            ],
            savingsGoals: [
                { title: 'Travel', progress: '75%' },
                { title: 'Home', progress: '76%' },
                { title: 'Emergency Fund', progress: '70%' }
            ]
        }
        const report2:IFinancialReport =     {
            totalIncome: 1300,
            totalExpenses: 2732,
            budgets: [
              { category: 'Entertainment', amountSpent: 300 },
              { category: 'Travel', amountSpent: 450 },
              { category: 'Groceries', amountSpent: 1200 }
            ],
            savingsGoals: [
              { title: 'Travel', progress: '75%' },
              { title: 'Home', progress: '76%' },
              { title: 'Emergency Fund', progress: '70%' }
            ]
        }    
        const report3:IFinancialReport = {
            totalIncome: 0,
            totalExpenses: 0,
            budgets: [],
            savingsGoals: [
                { title: 'Travel', progress: '75%' },
                { title: 'Home', progress: '76%' },
                { title: 'Emergency Fund', progress: '70%' }
            ]
        }
        expect(user.financialReport(new Date("2024-09-05"), new Date("2024-09-15"))).toEqual(report1);
        expect(user.financialReport(new Date("2024-09-20"), new Date("2024-09-26"))).toEqual(report2);
        expect(user.financialReport(new Date("2024-09-01"), new Date("2024-09-04"))).toEqual(report3);

    });

    test("Should throw an error when give period is invalid",()=>{
       expect(()=>user.financialReport(new Date("2024-09-20"), new Date("2024-09-08"))).toThrow("Invalid period");
    })
})

