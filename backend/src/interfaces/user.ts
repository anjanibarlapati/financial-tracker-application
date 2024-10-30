import { ObjectId } from "mongoose";
import { IBudget } from "./budget";
import { IIncome } from "./income";
import { ISavingsGoal } from "./savingsGoals";
import { ITransaction } from "./transactions";

export interface IUser{
    username: string;
    password: string;
    income:IIncome[];
    totalIncome:number;
    transactions:ITransaction[];
    availableBalance:number;
    budgets:IBudget[];
    totalBudget:number;
    savingsGoals:ISavingsGoal[];
    _id?:ObjectId;
    __v?:number;
}
