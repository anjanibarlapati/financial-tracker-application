import promptSync from "prompt-sync";
import nconf from 'nconf';
import {  User as UserClass} from "../src/classes/users";
import { login } from "../src/functions/login";
import { register } from "../src/functions/registration";
import { IFinancialReport, IFinancialReportBudget, IFinancialReportSavingsGoal } from "../src/interfaces/financialReport";
import { IUser } from "../src/interfaces/user";

const prompt = promptSync();
nconf.argv().file({ file: '../config.json' });


async function userIput(message:string){
    return prompt(message)
}

async function registerUser(){
  let userDocument: IUser;
  let user: UserClass;
  try {
    const username = await userIput("Enter username: ");
    const password = await userIput("Enter password: ");
    userDocument = await register(username, password);

    user = new UserClass(userDocument.username, userDocument.password);

    console.log(`\nWelcome, ${username}`);
    await options(user);
  } catch (error) {
    console.log(error);
  }
}

async function loginUser() {
  let userDocument: IUser;
  let user: UserClass;
  try {
    const username = await userIput("Enter username: ");
    const password = await userIput("Enter password: ");
    userDocument= await login(username, password);

    if (userDocument) {
      user = new UserClass(userDocument.username, userDocument.password);
      
      const { _id, __v, ...updatedUser } = userDocument;
      Object.assign(user, updatedUser);

      console.log(`\nWelcome back, ${username}`);
      await options(user);
    } else {
      console.log("Please check your credentials");
    }
  } catch (error) {
    console.log(error);
  }
  
}

async function transaction(user: UserClass){
  try {
    const transactionType = await userIput("Enter transaction type debit or credit: ");
    const amount = await userIput("Enter amount: ");
    const category = await userIput("Enter category: ");

    const transaction = {id: user.transactions.length + 1, type: transactionType as "debit" | "credit", amount: Number(amount), category: category, date: new Date()}
    await user.transaction(transaction);

    console.log("Transaction added successfully");
  } catch (error) {
    console.log(error);
  }
}

async function addBudget(user: UserClass){
  try {
    const category = await userIput("Enter new budget category: ");
    const amount = await userIput("Enter amount: ");
    await user.setBudget(category, Number(amount));
    console.log("Budget added successfully");
  } catch (error) {
    console.log(error);
  }
}

async function updateBudgetAmount(user:UserClass){
  try {
    const category = await userIput("Enter budget category to update: ");
    const amount = await userIput("Enter new amount: ");
    await user.updateBudgetAmount(category, Number(amount));
    console.log("Budget updated successfully");
  } catch (error) {
    console.log(error);
  }
}

async function checkBudgetSpent(user:UserClass){
  try {
    const category = await userIput("Enter budget category to check amount spent on: ");
    const amountSpent:number =  user.checkBudgetSpent(category);
    console.log(`You spent ${amountSpent} on ${category}`)
  } catch (error) {
    console.log(error);
  }
}

async function addSavingsGoal(user:UserClass){
  try {
    const title = await userIput("Enter new savings goal title: ");
    const targetAmount = await userIput("Enter target amount: ");
    await user.addSavingsGoal({ title: title, targetAmount: Number(targetAmount), currentAmountSaved: 0 });
    console.log("Savings goal added successfully");
  } catch (error) {
    console.log(error);
  }
}

async function addAmountToASavingsGoal(user:UserClass){
  try {
    const title = await userIput("Enter savings goal title: ");
    const amount = await userIput("Enter amount to add: ");
    await user.addAmountToASavingsGoal(title, Number(amount));
    console.log("Amount added to savings goal");
  } catch (error) {
    console.log(error);
  }
}

async function checkSavingsGoalProgress(user:UserClass){
  try {
    const title = await userIput("Enter savings goal title to check progress: ");
    const progress:number = user.checkSavingsGoalProgress(title);
    console.log(`Progress towards ${title} is ${progress}%`)
  } catch (error) {
    console.log(error);
  }
}

async function totalIncomeAndExpenses(user:UserClass){
  try {
    const fromDate = await userIput("Enter from date (YYYY-MM-DD): ");
    const toDate = await userIput("Enter to date (YYYY-MM-DD): ");
    const report:IFinancialReport = user.totalIncomeAndExpenses(new Date(fromDate), new Date(toDate));
    console.log(report);
  } catch (error) {
    console.log(error);
  }

}

async function budgetSummary(user:UserClass){
  try {
    const report:IFinancialReportBudget[] = user.budgetSummary();
     console.log(report);
   } catch (error) {
     console.log(error);
   }
}

async function savingsGoalsProgress(user:UserClass){
  try {
    const report:IFinancialReportSavingsGoal[] = user.savingsGoalsProgress();
    console.log(report);
  } catch (error) {
    console.log(error);
  }

}

async function addTransactionsfromCSVFile(user:UserClass){
    try{
        const transactionsPath:string = nconf.get("transactionsPath");
        await user.addTransactionsfromCSVFile(transactionsPath);
    } catch(error){
      console.log(error);
    }
}

async function start() {
  console.log("\n********* Welcome to FinGrow Application *********");
  console.log("\n Register or Login into the application");
  console.log(`
        1. Register to FinGrow application
        2. Login into the FinGrow application
        3. Close application\n`);

    const option = await userIput("Enter any option: ");
    
    switch (option) {
      case "1":
        await registerUser();
        break;
      case "2":
        await loginUser();
        break;
      case "3":
        console.log("Closing the application...");
        return;
      default:
        console.log("Please enter a valid option :)");
    }
 
}



async function options(user:UserClass){
  console.log("\nList of operations");
  console.log(`
        1. Get user data
        2. Log out from the application
        3. Perform a transaction
        4. Add new budget category
        5. Update an existing budget category
        6. Check amount spent on a budget category
        7. Add a new savings goal
        8. Add amount to an existing saving goal
        9. Check progress of a saving goal
        10. Get total income and expenses over a specific period
        11. Get summary of budget usage across different categories
        12. Get progress towards savings goals
        13. Insert transactions from a CSV file\n`);
   await operations(user);
}
 

async function operations(user: UserClass) {

  const option = await userIput("Enter any option: ");

  switch (option) {
    case "1": {
      console.log(user);
      break;
    }

    case "2": {
      console.log("Exiting the application...");
      await start();
      return;
    }
    case "3": {
      await transaction(user);
      break;
    }
    case "4": {
      await addBudget(user);
      break;
    }
    case "5": {
      await updateBudgetAmount(user);
      break;
    }
    case "6": {
      await checkBudgetSpent(user);
      break;
    }
    case "7": {
      await addSavingsGoal(user);
      break;
    }
    case "8": {
      await addAmountToASavingsGoal(user);
      break;
    }
    case "9": {
      await checkSavingsGoalProgress(user);
      break;
    }
    case "10": {
      await totalIncomeAndExpenses(user);
      break;
    }
    case "11": {
      await budgetSummary(user);
      break;
    }
    case "12": {
      await savingsGoalsProgress(user);
      break;
    }
    case "13": {
        await addTransactionsfromCSVFile(user);
        break;
    }
    default: {
      console.log("Please enter a valid option :)");
      break;
    }

  }
  await operations(user);
}

start();





