import { IBudget } from "./budget";
import { IFinancialReport, IFinancialReportBudget } from "./financialReport";
import { IIncome } from "./income";
import { ISavingsGoal } from "./savingsGoals";
import { ITransaction } from "./transactions";

export interface IUser{
    id:number;
    username: string;
    password: string;
    income:IIncome[];
    totalIncome:number;
    transactions:ITransaction[];
    availableBalance:number;
    budgets:IBudget[];
    totalBudget:number;
    savingsGoals:ISavingsGoal[];
    transaction: (txn:ITransaction) => void;
    isValidTransaction: (txn:ITransaction) => void;
    setBudget: (category:string, amount:number) => void;
    updateBudgetAmount: (category:string, amount:number)=>void;
    checkBudgetSpent: (category:string) => number;
    updateBudgetAmountSpent: (txn:ITransaction) => void;
    addSavingsGoal: (savingsGoal:ISavingsGoal) => void;
    addAmountToASavingsGoal: (title:string, amount:number ) => void;
    checkSavingsGoalProgress: (title:string) => number;
    financialReport: (fromDate:Date, toDate:Date) =>  IFinancialReport;
    financialReportBudget: (txn:ITransaction, budgets:IFinancialReportBudget[]) => void;
}
