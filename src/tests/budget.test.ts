
import { User } from "../classes/users";
import { register } from "../functions/registration";
import { ITransaction } from "../interfaces/transactions";

describe("Budget Functionality",()=>{

    let user :User;

    beforeAll(()=>{
        user = register("anjani", "anjani123");
    })

    test("Should add a new budget to budget list",()=>{
        const txn1:ITransaction = {id:user.transactions.length+1, type: "credit", amount:1000, category:"Salary", date:new Date()};
        const txn2:ITransaction = {id:user.transactions.length+1, type: "credit", amount:4000, category:"Others", date:new Date()}
        user.transaction(txn1);
        user.transaction(txn2);

        user.setBudget("Groceries", 1000);
        expect(user.totalBudget).toBe(1000);
    })

    test("Should throw an error if budget already exist",()=>{
         expect(()=>user.setBudget("Groceries",1000)).toThrow("Budget for this category already exists");
    })

    test("Should throw an error if new budget amount is less than zero",()=>{
        expect(()=>user.setBudget("Travel",-1000)).toThrow("Budget amount should be greater than zero");
        expect(()=>user.setBudget("Travel", 0)).toThrow("Budget amount should be greater than zero");
    })

    test("Should update an existing budget for a given category", () => {
        user.setBudget("Entertainment", 1000);
        user.updateBudgetAmount("Entertainment", 1500);
        expect(user.totalBudget).toBe(2500);
    });

    test("Should throw an error when update an existing budget with non-positive amount", () => {

        expect(() => user.setBudget("Entertainment", -1000)).toThrow("Updated budget amount should be greater than zero");
        expect(() => user.setBudget("Entertainment", 0)).toThrow("Updated budget amount should be greater than zero");
    });

    test("Should throw an error when updating a budget category that does not exist", () => {
        
        expect(()=>user.updateBudgetAmount("other", 1500)).toThrow("Budget for this category do not exist");
    });

    test("Should return the total amount spent on given category",()=>{

        const txn1: ITransaction = { id: user.transactions.length + 1, type: "debit", amount: 200, category: "Groceries", date: new Date() };
        const txn2: ITransaction = { id: user.transactions.length + 1, type: "debit", amount: 500, category: "Groceries", date: new Date() };

        user.transaction(txn1);
        user.transaction(txn2);

        const amountSpent = user.checkBudgetSpent("Groceries");
        expect(amountSpent).toBe(700);
    })

    test("Should throw an error when checking amount spent on a budget category that do not exist",()=>{
       
        expect(()=>user.checkBudgetSpent("Travel")).toThrow("Budget for this category do not exist");
    })

    test("Should throw an error when add budget category exceeds available balance",()=>{
        
        expect(()=>user.setBudget("Rent", 20000)).toThrow("Adding this budget will exceeds the available balance");
    })
})