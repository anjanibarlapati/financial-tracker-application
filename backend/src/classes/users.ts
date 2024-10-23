import { addAmountToASavingsGoal, addBudget, addIncome, addSavingsGoal, addTransaction, debitAmount, updateBudgetAmount, updateBudgetAmountSpent, updateIncomeAmount } from "../services/usersApis";
import { IBudget } from "../interfaces/budget";
import { IFinancialReport, IFinancialReportBudget, IFinancialReportSavingsGoal } from "../interfaces/financialReport";
import { IIncome } from "../interfaces/income";
import { ISavingsGoal } from "../interfaces/savingsGoals";
import { ITransaction } from "../interfaces/transactions";
import { IUser } from "../interfaces/user";
import fs from 'fs';
import csvParser from 'csv-parser';


export class User implements IUser {
    username: string;
    password: string;
    income: IIncome[];
    totalIncome: number;
    transactions: ITransaction[];
    availableBalance: number;
    budgets: IBudget[];
    totalBudget: number;
    savingsGoals: ISavingsGoal[];

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
        this.income = [];
        this.totalIncome = 0;
        this.transactions = [];
        this.availableBalance = 0;
        this.budgets = [];
        this.totalBudget = 0;
        this.savingsGoals = [];
    }

    isValidTransaction(transaction: ITransaction) {

        if (transaction.amount <= 0)
            throw new Error("Transaction amount should greater than zero");
        if (!transaction.category || transaction.category.trim() === '')
            throw new Error("Transaction category should be non-empty");

        if (transaction.type === "debit" && transaction.amount > this.availableBalance)
            throw new Error("Insufficient balance");

    }

    async updateBudgetAmountSpent(transaction: ITransaction) {

        const budget = this.budgets.find((budget) => budget.category === transaction.category);

        if (!budget) {
            return;
        }
        if (budget.amount - (budget.amountSpent + transaction.amount) < 0) {
            throw new Error("Insufficient budget for given category");
        }
        this.budgets.forEach(async (budget) => {
            if (budget.category === transaction.category) {
                await updateBudgetAmountSpent(this.username, transaction.category, transaction.amount);
                return budget.amountSpent += transaction.amount;
            }
        })
    }

    async transaction(transaction: ITransaction) {
        let progress: number = 0;
        this.isValidTransaction(transaction);

        if (transaction.type === 'credit') {
            this.availableBalance += transaction.amount;

            const savingsGoalIndex = this.savingsGoals.findIndex(goal => goal.title === transaction.category);

            if (savingsGoalIndex !== -1) {
                await this.addAmountToASavingsGoal(transaction.category, transaction.amount);
                progress = this.checkSavingsGoalProgress(transaction.category);
            }
            else {
                this.totalIncome += transaction.amount;
                const index = this.income.findIndex(income => income.source === transaction.category);
                if (index === -1) {
                    this.income.push({ source: transaction.category, amount: transaction.amount });
                    await addIncome(this.username, transaction.category, transaction.amount);
                }

                else {
                    this.income[index].amount += transaction.amount;
                    await updateIncomeAmount(this.username, transaction.category, transaction.amount);
                }
            }
        }
        else {
            try{
                await this.updateBudgetAmountSpent(transaction);
            } catch(error){
                return "Insufficient budget for given category";
            }
            this.availableBalance -= transaction.amount;
            await debitAmount(this.username, transaction.amount);
        }

        this.transactions.push(transaction);

        await addTransaction(this.username, transaction);

        if (progress >= 90) {
            return (`You have reached ${progress}% of the target amount`);
        }
    }

    async setBudget(category: string, amount: number) {

        const isBudgetExist = this.budgets.some(budget=> budget.category === category);

        if (isBudgetExist) {
            throw new Error("Budget for this category already exists");
        }

        if (amount <= 0) {
            throw new Error("Budget amount should be greater than zero")
        }
        if (this.totalBudget + amount > this.availableBalance) {
            throw new Error("Adding this budget will exceeds the available balance")
        }
        this.budgets.push({ category: category, amount: amount, amountSpent: 0 });
        this.totalBudget += amount;
        await addBudget(this.username, category, amount)

    }

    async updateBudgetAmount(category: string, amount: number) {

        const budgetIndex = this.budgets.findIndex(budget => budget.category === category);

        if (budgetIndex === -1) {
            throw new Error("Budget for this category do not exist");
        }
        if (amount <= 0) {
            throw new Error("Updated budget amount should be greater than zero")
        }

        if (this.totalBudget + amount > this.availableBalance) {
            throw new Error("Updating this budget will exceeds the available balance")
        }

        const currentBudget = this.budgets[budgetIndex].amount;
        this.budgets[budgetIndex].amount = amount;
        this.totalBudget = this.totalBudget - currentBudget + amount;
        await updateBudgetAmount(this.username, category, amount, this.totalBudget);

    }

    checkBudgetSpent(category: string) {

        const budgetIndex = this.budgets.findIndex(budget => budget.category === category);
        if (budgetIndex === -1) {
            throw new Error("Budget for this category do not exist");
        }
        return this.budgets[budgetIndex].amountSpent;
    }

    async addSavingsGoal(savingsGoal: ISavingsGoal) {

        if (savingsGoal.targetAmount <= 0) {
            throw new Error("Savings goal target amount should be greater than zero");
        }
        if (savingsGoal.currentAmountSaved < 0) {
            throw new Error("Savings goal current saved amount should be non-negative amount");

        }

        const goal: boolean = this.savingsGoals.some(goal => goal.title === savingsGoal.title);
        if (goal) {
            throw new Error("Savings goal with this title already exists");
        }

        this.savingsGoals.push(savingsGoal);
        await addSavingsGoal(this.username, savingsGoal);

    }

    async addAmountToASavingsGoal(title: string, amount: number) {

        const index: number = this.savingsGoals.findIndex(goal => goal.title === title);

        if (this.savingsGoals[index].currentAmountSaved + amount > this.savingsGoals[index].targetAmount) {
            throw new Error("Saving amount exceeding target amount");
        }
        this.savingsGoals[index].currentAmountSaved += amount;
        await addAmountToASavingsGoal(this.username, title, amount);
    }

    checkSavingsGoalProgress(title: string) {

        const index: number = this.savingsGoals.findIndex(goal => goal.title === title);
        if (index === -1) {
            throw new Error("Savings goal with this title do not exist");
        }
        const targetAmount = this.savingsGoals[index].targetAmount;
        const amountSaved = this.savingsGoals[index].currentAmountSaved;
        const progress: number = Number(((amountSaved / targetAmount) * 100).toFixed(0));

        return progress;

    }

    totalIncomeAndExpenses(fromDate: Date, toDate: Date) {
        let report: IFinancialReport;
        let totalIncome: number = 0, totalExpenses: number = 0;

        if (fromDate > toDate) {
            throw new Error("Invalid period");
        }
        for (let i = 0; i < this.transactions.length; i++) {

            if (this.transactions[i].type === 'debit' && new Date(this.transactions[i].date) >= fromDate && new Date(this.transactions[i].date) <= toDate) {
                totalExpenses += this.transactions[i].amount;
            }
            if (this.transactions[i].type === 'credit' && new Date(this.transactions[i].date) >= fromDate && new Date(this.transactions[i].date) <= toDate) {
                totalIncome += this.transactions[i].amount;
            }
        }
        report = {
            totalIncome: totalIncome,
            totalExpenses: totalExpenses,
        }
        return report;

    }

    financialReportBudget(transaction: ITransaction, budgets: IFinancialReportBudget[]) {

        const index = budgets.findIndex(budget => budget.category === transaction.category);
        if (index !== -1) {
            budgets[index].amountSpent += transaction.amount;
        }
    }

    budgetSummary(fromDate: Date, toDate: Date) {

        let budgetSummary: IFinancialReportBudget[] = this.budgets.map((budget) => { return { ...budget, amountSpent: 0 } });
        for (let i = 0; i < this.transactions.length; i++) {
            if (this.transactions[i].type === 'debit' && new Date(this.transactions[i].date) >= fromDate && new Date(this.transactions[i].date) <= toDate && this.transactions[i].category !== "Other") {
                this.financialReportBudget(this.transactions[i], budgetSummary);
            }
        }
        return budgetSummary;
    }

    financialReportSavingsGoals(transaction: ITransaction, savingsGoals: IFinancialReportSavingsGoal[]) {
        const index = savingsGoals.findIndex(goal => goal.title === transaction.category);
        if (index !== -1) {
            savingsGoals[index].currentAmountSaved += transaction.amount;
        }
    }

    savingsGoalsProgress(fromDate: Date, toDate: Date) {
        let savingsGoalsReport: IFinancialReportSavingsGoal[] = this.savingsGoals.map((goal: ISavingsGoal) => { return { title: goal.title, targetAmount: goal.targetAmount, currentAmountSaved: 0, progress: "0%" } });

        for (let i = 0; i < this.transactions.length; i++) {
            if (this.transactions[i].type === 'credit' && new Date(this.transactions[i].date) >= fromDate && new Date(this.transactions[i].date) <= toDate && this.transactions[i].category !== "Other") {
                this.financialReportSavingsGoals(this.transactions[i], savingsGoalsReport);
            }
        }

        savingsGoalsReport = savingsGoalsReport.map((goal) => {
            return { ...goal, progress: ((goal.currentAmountSaved / goal.targetAmount) * 100).toFixed(1) + "%" }
        });
        return savingsGoalsReport;
    }

    async addTransactionsfromCSVFile(transactionsPath: string) {

        if (!transactionsPath || transactionsPath.trim() === "") {
            throw new Error("Transactions data path is not defined")
        }

        const fileStream = fs.createReadStream(transactionsPath);
        const csvPipe = fileStream.pipe(csvParser());
        let count = 0;

        for await (const data of csvPipe) {
            console.log("Processing Record " + (++count) + ": " + data);
            const transaction = {
                id: this.transactions.length + 1,
                type: data.type as "debit" | "credit",
                amount: Number(data.amount),
                category: data.category,
                date: new Date(data.date),
            };

            await this.transaction(transaction);
            console.log("Transaction inserted");
        }

        console.log("Inserted transactions");
    }

}