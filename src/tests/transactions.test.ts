import { register } from "../functions/registration";
import { ITransaction } from "../interfaces/transactions";


describe("Transactions Functionality",()=>{

    test("Should credit given amount when all correct details are provided",()=>{

        const user= register("anjani", "anjani123");      
        const txn:ITransaction = {id:user.transactions.length+1, userId: user.id, type: "credit", amount:10000, category:"Salary", date:new Date()};
        user.transaction(txn);

        expect(user.availableBalance).toBe(10000);  
        expect(user.totalIncome).toBe(10000);
    });
    
})
