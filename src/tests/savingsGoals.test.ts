import { start } from "../../backend/testIndex";
import { User as UserClass } from "../classes/users";
import { register } from "../functions/registration";
import { ISavingsGoal } from "../interfaces/savingsGoals";
import { ITransaction } from "../interfaces/transactions";
import { User as UserModel} from "../../backend/models/users";
import { Server, IncomingMessage, ServerResponse } from "http";
import mongoose from "mongoose";
import { IUser } from "../interfaces/user";


describe("Savings Goals Functionality",()=>{

    let server: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;

    let userDocument:IUser;
    let user:UserClass;
    
    beforeAll(async () => {
        server = await start();
        userDocument = await register("anjani", "anjani123");
        user = new UserClass(userDocument.username, userDocument.password);

        const txn1:ITransaction = {id:user.transactions.length+1, type: "credit", amount:10000, category:"Salary", date:new Date()};
        await user.transaction(txn1);
        const txn2:ITransaction = {id:user.transactions.length+1, type: "credit", amount:10000, category:"Others", date:new Date()}
        await user.transaction(txn2);

    });

    afterAll(async () => {
        await UserModel.deleteMany(); 
        await mongoose.connection.close();
        console.log("Connection closed successfully");
        if(server)
           server.close();
    });

    test("Should add a new savings goal to savings goals list", async ()=>{

        const savingsGoal = {title: "Travel", targetAmount:2000, currentAmountSaved:0}
        await user.addSavingsGoal(savingsGoal);

        expect(user.savingsGoals).toContainEqual(savingsGoal);
    })

    test("Should throw an error if savings goal with this title already exist", async ()=>{
        await expect(user.addSavingsGoal({title: "Travel", targetAmount:1000, currentAmountSaved:0})).rejects.toThrow("Savings goal with this title already exists");
    })

    test("Should throw an error if savings goal target amount is less than zero", async()=>{
        await expect(user.addSavingsGoal({title: "Home", targetAmount:-1000, currentAmountSaved:0})).rejects.toThrow("Savings goal target amount should be greater than zero");
        await expect(user.addSavingsGoal({title: "Home", targetAmount:0, currentAmountSaved:0})).rejects.toThrow("Savings goal target amount should be greater than zero");
    })

    test("Should throw an error if savings goal current saved amount is negative amount",async ()=>{
        await expect(user.addSavingsGoal({title: "Home", targetAmount:1000, currentAmountSaved:-1000})).rejects.toThrow("Savings goal current saved amount should be non-negative amount");
    })

    test("Should update an existing savings goal current saved amount", async () => {

        await user.addSavingsGoal({title: "Emergency Fund", targetAmount:1000, currentAmountSaved:0});
        await user.addAmountToASavingsGoal("Emergency Fund", 500);
        expect(user.savingsGoals.find(g => g.title === "Emergency Fund")?.currentAmountSaved).toBe(500);
    });

    test("Should throw an error when saving amount exceeds target", async () => {

        const savingsGoal: ISavingsGoal = { title: "Home", targetAmount: 5000, currentAmountSaved: 2000 };
        await user.addSavingsGoal(savingsGoal);

        await expect(user.addAmountToASavingsGoal("Home", 5000)).rejects.toThrow("Saving amount exceeding target amount");
    });

    test("Should throw an error when update current saved amount with a non-positive amount", async () => {
        await expect(user.addAmountToASavingsGoal("Emergency Fund", -500)).rejects.toThrow("Updated current saved amount should be greater than zero");
        await expect(user.addAmountToASavingsGoal("Emergency Fund", 0)).rejects.toThrow("Updated current saved amount should be greater than zero");

    });

    test("Should throw an error when update a savings goal amount that do not exist", async () => {
        await expect(user.addAmountToASavingsGoal("Other", 500)).rejects.toThrow("Savings goal with this title do not exist");
    });

    test("Should check progress towards a specific savings goal", async () => {
        const goal1: ISavingsGoal = { title: "Health", targetAmount: 5000, currentAmountSaved: 0 };
        await  user.addSavingsGoal(goal1);
        await user.addAmountToASavingsGoal("Health", 2500)
        const goal2: ISavingsGoal = { title: "Marraige", targetAmount: 5000, currentAmountSaved: 0 };
        await user.addSavingsGoal(goal2);
        await user.addAmountToASavingsGoal("Marraige", 4600)


        expect(user.checkSavingsGoalProgress("Health")).toEqual(50);
        expect(user.checkSavingsGoalProgress("Marraige")).toEqual(92);

    });

    test("Should throw an error when checking progress for a savings goal that do not exist", () => {
        expect(()=>user.checkSavingsGoalProgress("Other")).toThrow("Savings goal with this title do not exist");
    });


})