import { User } from "../classes/users";
import { login } from "../functions/login";
import { register } from "../functions/registration";
import { ITransaction } from "../interfaces/transactions";


describe("Transactions Functionality",()=>{
    let user:User;
    beforeAll(()=>{
      user = register("anjani", "anjani123");
    })

    test("Should credit given amount when all correct details are provided",()=>{

        const txn:ITransaction = {id:user.transactions.length+1, type: "credit", amount:10000, category:"Salary", date:new Date()};
        user.transaction(txn);

        expect(user.availableBalance).toBe(10000);  
        expect(user.totalIncome).toBe(10000);
    });

    test("Should add credit amount to income if such category exists",()=>{
        
        const txn1:ITransaction = {id:user.transactions.length+1, type: "credit", amount:5000, category:"Others", date:new Date()};
        const txn2:ITransaction = {id:user.transactions.length+1, type: "credit", amount:5000, category:"Others", date:new Date()}
        user.transaction(txn1);
        user.transaction(txn2);
        expect(user.availableBalance).toBe(20000);  
        expect(user.totalIncome).toBe(20000);
    });

    test("Should debit given amount when all correct details are provided",()=>{

        const txn:ITransaction = {id:user.transactions.length+1, type: "debit", amount:1000, category:"Groceries", date:new Date()}
        user.transaction(txn);
        expect(user.availableBalance).toBe(19000);   
    });

    test("should throw an error when debit amount is more than the available balance", () => {

        const txn:ITransaction = {id:user.transactions.length+1, type: "debit", amount:100000, category:"Salary", date:new Date()}
        expect(() => user.transaction( txn)).toThrow("Insufficient balance");
    });

    test("should throw an error when transaction details invalid", () => {

        const txn1:ITransaction = {id:user.transactions.length+1, type: "debit", amount:-100, category:"Salary", date:new Date()}
        const txn2:ITransaction = {id:user.transactions.length+1, type: "debit", amount:100, category:"", date:new Date()}

        expect(() => user.transaction( txn1)).toThrow("Transaction amount should greater than zero");
        expect(() => user.transaction( txn2)).toThrow("Transaction category should be non-empty");
    });
    
})
