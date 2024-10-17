import { IUser } from "../../src/interfaces/user";

export let users:IUser[]=[
    {
        username:"anjani",
        password:"anjani123",
        transactions:[],
        income:[
            { source:"Rental Salary", amount:10000 },
            { source:"Business", amount:10000 }
        ],
        availableBalance:20000,
        totalIncome:20000,
        budgets:[],
        totalBudget:0,
        savingsGoals:[],
    },
    {
        username:"anjanii",
        password:"anjani1234",
        transactions:[
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

        ],        
        income:[
            { source:"Rental Salary", amount:10000 },
            { source:"Business", amount:5000 },
            {source:"Salary", amount:10000},
            {source:"Other", amount:1300}
        ],
        availableBalance:17875, 
        totalIncome:26300,
        budgets:[
            {category: "Groceries", amount:10000, amountSpent:5000},
            {category: "Entertainment", amount:5000, amountSpent:1000},
            {category: "Travel", amount:1000, amountSpent:800}
        ],
        totalBudget:16000,
        savingsGoals:[
            {title: "Travel", targetAmount:2000, currentAmountSaved:1500},
            {title: "Home", targetAmount:5000, currentAmountSaved:3800},
            {title: "Emergency Fund", targetAmount:1000, currentAmountSaved:700}
        ],
    }
]