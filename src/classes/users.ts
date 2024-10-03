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

   isValidTransaction(txn:ITransaction){

      if(txn.amount<=0)
          throw new Error("Transaction amount should greater than zero");
  
      if(txn.category.trim()==='')
          throw new Error("Transaction category should be non-empty");
  
      if(txn.type==="debit" && txn.amount > this.availableBalance)
          throw new Error("Insufficient balance");
       
  }

   transaction(txn:ITransaction){

      this.isValidTransaction(txn);
      
      this.transactions.push(txn);

      if(txn.type=== 'credit'){
         this.availableBalance+=txn.amount;
         const index = this.income.findIndex(i=>i.source=== txn.category);
         if(index===-1){
             this.income.push({source:txn.category, amount:txn.amount});
         }
         else{
             this.income[index].amount+=txn.amount;
         }
         this.totalIncome+=txn.amount;
     }
     else{
      this.availableBalance-=txn.amount;
     } 
   }

}