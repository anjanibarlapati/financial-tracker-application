import { users } from "../data/users";
import { IBudget } from "../interfaces/budget";
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
   budgets: IBudget[];
   totalBudget: number;

   constructor( username:string, password:string ){
      this.id = users.length+1;
      this.username = username;
      this.password = password;
      this.income = [];
      this.totalIncome = 0;
      this.transactions = [];
      this.availableBalance = 0;  
      this.budgets = [];
      this.totalBudget = 0; 
   }

   isValidTransaction(txn:ITransaction){

      if(txn.amount<=0)
          throw new Error("Transaction amount should greater than zero");
  
      if(txn.category.trim()==='')
          throw new Error("Transaction category should be non-empty");
  
      if(txn.type==="debit" && txn.amount > this.availableBalance)
          throw new Error("Insufficient balance");
       
    }

    updateBudgetAmountSpent(txn:ITransaction){
    

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
            this.updateBudgetAmountSpent(txn);
            this.availableBalance-=txn.amount;
        } 
   }

   setBudget(category:string, amount:number){

        const isBudgetExist = this.budgets.some(b=>b.category === category);

        if(isBudgetExist){
            throw new Error("Budget for this category already exists");
        }
     
        if(amount<=0){
            throw new Error("Budget amount should be greater than zero")
        }
        if(this.totalBudget+amount > this.totalIncome){
            throw new Error("Adding this budget will exceeds the available balance")
        }
        this.budgets.push({category:category, amount:amount, amountSpent:0});
        this.totalBudget += amount;
   }  

   updateBudgetAmount(category:string, amount:number){

        const budgetIndex = this.budgets.findIndex(b=>b.category ===category);

        if(budgetIndex === -1){
            throw new Error("Budget for this category do not exist");
        }
        if(amount<=0){
            throw new Error("Updated budget amount should be greater than zero")
        }

        const currentBudget= this.budgets[budgetIndex].amount;
        this.budgets[budgetIndex].amount=amount;
        this.totalBudget = this.totalBudget - currentBudget + amount;
   }

   checkBudgetSpent(category:string){
           
        const budgetIndex = this.budgets.findIndex(b=>b.category ===category);
        if(budgetIndex === -1){
            throw new Error("Budget for this category do not exist");
        }
        return this.budgets[budgetIndex].amountSpent;
   }

}