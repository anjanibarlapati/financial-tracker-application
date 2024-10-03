import { login } from "../functions/login";
import { register } from "../functions/registration";
import { ITransaction } from "../interfaces/transactions";


describe("Transactions Functionality",()=>{

    test("Should credit given amount when all correct details are provided",()=>{

        const user= register("anjani", "anjani123");      
        const txn:ITransaction = {id:user.transactions.length+1, type: "credit", amount:10000, category:"Salary", date:new Date()};
        user.transaction(txn);

        expect(user.availableBalance).toBe(10000);  
        expect(user.totalIncome).toBe(10000);
    });

    test("Should add credit amount to income if such category exists",()=>{

        const user = login("anjani", "anjani123");
        
        const txn1:ITransaction = {id:user.transactions.length+1, type: "credit", amount:5000, category:"Others", date:new Date()};
        const txn2:ITransaction = {id:user.transactions.length+1, type: "credit", amount:5000, category:"Others", date:new Date()}
        user.transaction(txn1);
        user.transaction(txn2);
        expect(user.availableBalance).toBe(20000);  
        expect(user.totalIncome).toBe(20000);
    });
    
})
