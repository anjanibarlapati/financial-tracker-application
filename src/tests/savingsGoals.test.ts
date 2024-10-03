import { User } from "../classes/users";
import { register } from "../functions/registration";
import { ISavingsGoal } from "../interfaces/savingsGoals";
import { ITransaction } from "../interfaces/transactions";

describe("Savings Goals Functionality",()=>{
    
    let user :User;
    
    beforeAll(()=>{
       user = register("anjani", "anjani123");
       const txn1:ITransaction = {id:user.transactions.length+1, type: "credit", amount:10000, category:"Salary", date:new Date()};
       const txn2:ITransaction = {id:user.transactions.length+1, type: "credit", amount:10000, category:"Others", date:new Date()}
       user.transaction(txn1);
       user.transaction(txn2);
    })

    test("Should add a new savings goal to savings goals list",()=>{

        const savingsGoal = {title: "Travel", targetAmount:2000, currentAmountSaved:0}
        user.addSavingsGoal(savingsGoal);

        expect(user.savingsGoals).toContainEqual(savingsGoal);
    })

    test("Should throw an error if savings goal with this title already exist",()=>{
        expect(()=>user.addSavingsGoal({title: "Travel", targetAmount:1000, currentAmountSaved:0})).toThrow("Savings goal with this title already exists");
    })

    test("Should throw an error if savings goal target amount is less than zero",()=>{
        expect(()=>user.addSavingsGoal({title: "Home", targetAmount:-1000, currentAmountSaved:0})).toThrow("Savings goal target amount should be greater than zero");
        expect(()=>user.addSavingsGoal({title: "Home", targetAmount:0, currentAmountSaved:0})).toThrow("Savings goal target amount should be greater than zero");
    })

    test("Should throw an error if savings goal current saved amount is negative amount",()=>{
        expect(()=>user.addSavingsGoal({title: "Home", targetAmount:1000, currentAmountSaved:-1000})).toThrow("Savings goal current saved amount should be non-negative amount");
    })

    test("Should update an existing savings goal current saved amount", () => {

        user.addSavingsGoal({title: "Emergency Fund", targetAmount:1000, currentAmountSaved:0});
        user.addAmountToASavingsGoal("Emergency Fund", 500);
        expect(user.savingsGoals.find(g => g.title === "Emergency Fund")?.currentAmountSaved).toBe(500);
    });

    test("Should throw an error when saving amount exceeds target", () => {

        const savingsGoal: ISavingsGoal = { title: "Home", targetAmount: 5000, currentAmountSaved: 2000 };
        user.addSavingsGoal(savingsGoal);

        expect(() => user.addAmountToASavingsGoal("Home", 5000)).toThrow("Saving amount exceeding target amount");
    });

    test("Should throw an error when update current saved amount with a non-positive amount", () => {
        expect(() => user.addAmountToASavingsGoal("Emergency Fund", -500)).toThrow("Updated current saved amount should be greater than zero");
        expect(() => user.addAmountToASavingsGoal("Emergency Fund", 0)).toThrow("Updated current saved amount should be greater than zero");

    });

    test("Should throw an error when update a savings goal amount that do not exist", () => {
        expect(() => user.addAmountToASavingsGoal("Other", 500)).toThrow("Savings goal with this title do not exist");
    });

    test("Should check progress towards a specific savings goal", () => {
        const goal1: ISavingsGoal = { title: "Health", targetAmount: 5000, currentAmountSaved: 2500 };
        const goal2: ISavingsGoal = { title: "Marraige", targetAmount: 5000, currentAmountSaved: 4600 };
        user.addSavingsGoal(goal1);
        user.addSavingsGoal(goal2)

        expect(user.checkSavingsGoalProgress("Health")).toEqual(50);
        expect(user.checkSavingsGoalProgress("Marraige")).toEqual(92);

    });

    test("Should throw an error when checking progress for a savings goal that do not exist", () => {
        expect(() => user.checkSavingsGoalProgress("Other")).toThrow("Savings goal with this title do not exist");
    });


})