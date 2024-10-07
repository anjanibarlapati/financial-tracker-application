import promptSync from "prompt-sync";
import { User } from "./classes/users";
import { login } from "./functions/login";
import { register } from "./functions/registration";
import { IFinancialReport, IFinancialReportBudget, IFinancialReportSavingsGoal } from "./interfaces/financialReport";

const prompt = promptSync();


function start() {
  console.log("\n********* Welcome to FinGrow Application *********");
  console.log("\n Register or Login into the application")
  console.log(`
        1. Register to FinGrow application
        2. Login into the FinGrow application
        3. Close application\n`);

  let user: User;

  const option = prompt("Enter any option: ");

  switch (option) {
    case "1": {
      try {
        const username = prompt("Enter username: ");
        const password = prompt("Enter password: ");
        user = register(username, password);
        console.log(`\nWelcome, ${username}`);
        options(user);
      } catch (error) {
        console.log(error);
      }
      break;
    }
    case "2": {
      try {
        const username = prompt("Enter username: ");
        const password = prompt("Enter password: ");
        user = login(username, password);
        if (user) {
          console.log(`\nWelcome back, ${username}`);
          options(user);
        } else {
          console.log("Please check your credentials");
        }
      } catch (error) {
        console.log(error);
      }
      break;
    }
    case "3": {
      console.log("Closing the application...");
      return;
    }
    default: {
      console.log("Please enter a valid option :)");
      break;
    }
  }
}



function options(user:User){
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
        12. Get progress towards savings goals\n`);
   operations(user);
}

function operations(user: User) {

  const option = prompt("Enter any option: ");

  switch (option) {
    case "1": {
      console.log(user);
      break;
    }

    case "2": {
      console.log("Exiting the application...");
      start();
      return;
    }
    case "3": {
      try {
        const transactionType = prompt("Enter transaction type debit or credit: ");
        const amount = prompt("Enter amount: ");
        const category = prompt("Enter category: ");
        user.transaction({
          id: user.transactions.length + 1,
          type: transactionType as "debit" | "credit",
          amount: Number(amount),
          category: category,
          date: new Date()
        });
        console.log("Transaction added successfully");
      } catch (error) {
        console.log(error);
      }
      break;
    }
    case "4": {
      try {
        const category = prompt("Enter new budget category: ");
        const amount = prompt("Enter amount: ");
        user.setBudget(category, Number(amount));
        console.log("Budget added successfully");
      } catch (error) {
        console.log(error);
      }
      break;
    }
    case "5": {
      try {
        const category = prompt("Enter budget category to update: ");
        const amount = prompt("Enter new amount: ");
        user.updateBudgetAmount(category, Number(amount));
        console.log("Budget updated successfully");
      } catch (error) {
        console.log(error);
      }
      break;
    }
    case "6": {
      try {
        const category = prompt("Enter budget category to check amount spent on: ");
        const amountSpent:number =  user.checkBudgetSpent(category);
        console.log(`You spent ${amountSpent} on ${category}`)
      } catch (error) {
        console.log(error);
      }
      break;
    }
    case "7": {
      try {
        const title = prompt("Enter new savings goal title: ");
        const targetAmount = prompt("Enter target amount: ");
        user.addSavingsGoal({ title: title, targetAmount: Number(targetAmount), currentAmountSaved: 0 });
        console.log("Savings goal added successfully");
      } catch (error) {
        console.log(error);
      }
      break;
    }
    case "8": {
      try {
        const title = prompt("Enter savings goal title: ");
        const amount = prompt("Enter amount to add: ");
        user.addAmountToASavingsGoal(title, Number(amount));
        console.log("Amount added to savings goal");
      } catch (error) {
        console.log(error);
      }
      break;
    }
    case "9": {
      try {
        const title = prompt("Enter savings goal title to check progress: ");
        const progress:number = user.checkSavingsGoalProgress(title);
        console.log(`Progress towards ${title} is ${progress}%`)
      } catch (error) {
        console.log(error);
      }
      break;
    }
    case "10": {
      try {
        const fromDate = prompt("Enter from date (YYYY-MM-DD): ");
        const toDate = prompt("Enter to date (YYYY-MM-DD): ");
        const report:IFinancialReport = user.totalIncomeAndExpenses(new Date(fromDate), new Date(toDate));
        console.log(report);
      } catch (error) {
        console.log(error);
      }
      break;
    }
    case "11": {
      try {
       const report:IFinancialReportBudget[] = user.budgetSummary();
        console.log(report);
      } catch (error) {
        console.log(error);
      }
      break;
    }
    case "12": {
      try {
        const report:IFinancialReportSavingsGoal[] = user.savingsGoalsProgress();
        console.log(report);
      } catch (error) {
        console.log(error);
      }
      break;
    }
    default: {
      console.log("Please enter a valid option :)");
      break;
    }

  }
  operations(user);
}

start();


