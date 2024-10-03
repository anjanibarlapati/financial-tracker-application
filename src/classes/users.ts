import { users } from "../data/users";
import { IBudget } from "../interfaces/budget";
import { IFinancialReport, IFinancialReportBudget, IFinancialReportSavingsGoal } from "../interfaces/financialReport";
import { IIncome } from "../interfaces/income";
import { ISavingsGoal } from "../interfaces/savingsGoals";
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
   savingsGoals: ISavingsGoal[];

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
      this.savingsGoals = [];
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
    
        const budget = this.budgets.find((b) => b.category === txn.category);
    
        if(!budget){
           return;
        }
        if(budget.amount-(budget.amountSpent+txn.amount) < 0){
            throw new Error("Insufficient budget for given category");
        }
        this.budgets.forEach((b)=>{
            if(b.category===txn.category) {
                return b.amountSpent+=txn.amount;
            }
        })
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
   
   addSavingsGoal(savingsGoal: ISavingsGoal) {

        if(savingsGoal.targetAmount <=0){
            throw new Error("Savings goal target amount should be greater than zero");
        }
        if(savingsGoal.currentAmountSaved<0){
            throw new Error("Savings goal current saved amount should be non-negative amount");

        }

        const goal:boolean = this.savingsGoals.some(s=> s.title === savingsGoal.title);
        if(goal){
            throw new Error("Savings goal with this title already exists");
        }
        
        this.savingsGoals.push(savingsGoal);

   }

   addAmountToASavingsGoal(title: string, amount: number) {

        if(amount<= 0){
            throw new Error("Updated current saved amount should be greater than zero")
        }
        const index:number = this.savingsGoals.findIndex(s=> s.title === title);
        if(index === -1){
            throw new Error("Savings goal with this title do not exist");
        }
        if( this.savingsGoals[index].currentAmountSaved + amount > this.savingsGoals[index].targetAmount){
            throw new Error("Saving amount exceeding target amount");
        }
        this.savingsGoals[index].currentAmountSaved= amount;

   }

   checkSavingsGoalProgress (title: string){

        const index:number = this.savingsGoals.findIndex(s=> s.title === title);
        if(index === -1){
            throw new Error("Savings goal with this title do not exist");
        }
        const targetAmount = this.savingsGoals[index].targetAmount;
        const amountSaved = this.savingsGoals[index].currentAmountSaved;
        const progress: number = Number(((amountSaved/targetAmount)*100).toFixed(0));
        return progress;
   }

   financialReportBudget(txn:ITransaction, budgets:IFinancialReportBudget[]){

    }

   financialReport(fromDate: Date, toDate: Date) {

   }

}