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
}
