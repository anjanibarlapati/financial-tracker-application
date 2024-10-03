import { IBudget } from "./budget";
import { IIncome } from "./income";
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
    transaction: (txn:ITransaction) => void;
    isValidTransaction: (txn:ITransaction) => void;
    setBudget: (category:string, amount:number) => void;
    updateBudgetAmount: (category:string, amount:number)=>void;
    checkBudgetSpent: (category:string) => number;
}
