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
    transaction: (txn:ITransaction) => void;
}
