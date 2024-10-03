import { users } from "../data/users";
import { IIncome } from "../interfaces/income";
import { ITransaction } from "../interfaces/transactions";
import { IUser } from "../interfaces/user";


export class User implements IUser  {

   id:number;
   username: string;
   password: string;
   income: IIncome[];
   totalIncome: number;
   transactions: ITransaction[];
   availableBalance: number;

   constructor( username:string, password:string ){
      this.id = users.length+1;
      this.username = username;
      this.password = password;
      this.income = [];
      this.totalIncome = 0;
      this.transactions = [];
      this.availableBalance = 0;   
   }

   transaction(txn:ITransaction){
      
      this.transactions.push(txn);

      if(txn.type=== 'credit'){
         this.availableBalance+=txn.amount;
         this.income.push({source:txn.category, amount:txn.amount});
         this.totalIncome+=txn.amount;
     }
   }

}