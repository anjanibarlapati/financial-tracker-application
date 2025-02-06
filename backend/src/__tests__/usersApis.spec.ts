import axios from 'axios';
import { IUser } from '../interfaces/user';
import { addAmountToASavingsGoal, addBudget, addIncome, addSavingsGoal, addTransaction, debitAmount, findUser, getUsers, insertUser, updateBudgetAmountSpent, updateBudgetAmount, updateIncomeAmount, isExistingUser,  } from '../services/usersApis';
import { User } from '../classes/users';
import { ITransaction } from '../interfaces/transactions';
import { ISavingsGoal } from '../interfaces/savingsGoals';

jest.mock('axios');

describe("User Routes", () => {
    let user: IUser = {
        username: "abc",
        password: "abc",
        transactions: [],
        income: [],
        availableBalance: 0,
        totalIncome: 0,
        budgets: [],
        totalBudget: 0,
        savingsGoals: [],
    };
    beforeEach(()=>{
        jest.clearAllMocks();
    })

    it("Should insert a new user into the database", async () => {
        (axios.post as jest.Mock).mockResolvedValue({data:user});
        const response = await insertUser(user as User);
        expect(axios.post).toHaveBeenCalledWith('http://localhost:4321/user', user);
        expect(response).toEqual(user);
    });

    it("Should handle error when inserting a new user", async () => {

        (axios.post as jest.Mock).mockRejectedValue(new Error("Failed to insert user"));
        
        await expect(insertUser(user as User)).rejects.toThrow('Failed to insert user');
    });

    it("Should send a GET request to fetch all users", async () => {
        const users = [user];
        (axios.get as jest.Mock).mockResolvedValue({ data: users });
        
        const result = await getUsers();
        
        expect(axios.get).toHaveBeenCalledWith('http://localhost:4321/users');
        expect(result).toEqual(users);
    });

    it("Should handle error when fetching all users", async () => {

        (axios.get as jest.Mock).mockRejectedValue(new Error("Failed to fetch all users"));
        
        await expect(getUsers()).rejects.toThrow('Failed to fetch all users');
    });

    it("Should send a GET request to find a specific user with given username and password", async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: user });
        
        const result = await findUser("abc", "abc");
        expect(axios.get).toHaveBeenCalledWith('http://localhost:4321/user', {params: { username: "abc", password: "abc" }});
        expect(result).toEqual(user);
    });

    it("Should handle error when finding a specific user with given username and password", async () => {

        (axios.get as jest.Mock).mockRejectedValue(new Error("Failed to find such user"));
        await expect(findUser("abc", "abc")).rejects.toThrow('Failed to find such user');
    });

    it("Should send a GET request to find a specific user with given username", async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: user });
        
        const result = await isExistingUser("abc");
        expect(axios.get).toHaveBeenCalledWith(`http://localhost:4321/user/${user.username}`);
        expect(result).toEqual(user);
    });

    it("Should handle error when finding a specific user with given username", async () => {

        (axios.get as jest.Mock).mockRejectedValue(new Error("Failed to find such user"));
        await expect(isExistingUser("abc")).rejects.toThrow('Failed to find such user');
    });

    it("Should update budget amount spent for the user", async () => {
        user = { ...user, budgets: [{ category: "groceries", amount: 1000, amountSpent: 100 }] };
        const updatedUser:IUser = {...user, budgets: [{ category: "groceries", amount: 1000, amountSpent: 200 }]};

        (axios.put as jest.Mock).mockResolvedValue({data:updatedUser});

        const result = await updateBudgetAmountSpent(user.username,"groceries", 100,);
        expect(axios.put).toHaveBeenCalledWith(`http://localhost:4321/user/budgetamountspent/${user.username}`, {category: "groceries", amount: 100, });
        expect(result).toEqual(updatedUser);
    });

    it("Should handle error when updating budget amount spent", async () => {

        (axios.put as jest.Mock).mockRejectedValue(new Error("Failed to update budget amount spent for the user"));

        await expect(updateBudgetAmountSpent(user.username,"groceries", 1000,)).rejects.toThrow('Failed to update budget amount spent for the user');
    });


    it("Should add a transaction for the user", async () => {
        user = { ...user, transactions: [ { "id": 1, "type": "credit", "amount": 10000, "category": "Rental Salary",  "date": new Date("2024-09-05")}] };

       (axios.put as jest.Mock).mockResolvedValue({data:user});
       const transaction:ITransaction = {id:user.transactions.length+1, type: "credit", amount:10000, category:"Salary", date:new Date()};;
        const response = await addTransaction(user.username, transaction);

        expect(axios.put).toHaveBeenCalledWith(`http://localhost:4321/user/transaction/${user.username}`, transaction);
        expect(response).toEqual(user);
 
    });

    it("Should handle error when adding a transaction", async () => {

        (axios.put as jest.Mock).mockRejectedValue(new Error("Error while inserting new transaction for the user"));

        const transaction :ITransaction = {id:user.transactions.length+1, type: "credit", amount:10000, category:"Salary", date:new Date()};;
        await expect(addTransaction(user.username, transaction)).rejects.toThrow('Error while inserting new transaction for the user');
    });

    it("Should add income for the user", async () => {
        user = { ...user, income: [ {source:"salary", amount:1000}]};

        (axios.put as jest.Mock).mockResolvedValue({data:user});

        const response = await addIncome(user.username, "salary",1000)

        expect(axios.put).toHaveBeenCalledWith(`http://localhost:4321/user/income/${user.username}`, {category: "salary",amount: 1000, });
        expect(response).toEqual(user);

    });

    it("Should handle error when adding income", async () => {

        (axios.put as jest.Mock).mockRejectedValue(new Error("Error while adding income to the user"));
   
        await expect(addIncome(user.username, "salary",1000)).rejects.toThrow('Error while adding income to the user');
    });

    it("Should update income amount for the user", async () => {
        user = { ...user, income: [ {source:"salary", amount:1000}]};
        const updatedUser = {...user, income: [ {source:"salary", amount:1200}] };
        (axios.put as jest.Mock).mockResolvedValue({data: updatedUser});

        const response = await updateIncomeAmount(user.username, "salary",200);

        expect(axios.put).toHaveBeenCalledWith(`http://localhost:4321/user/incomeamount/${user.username}`, {category: "salary", amount: 200, });
        expect(response).toEqual(updatedUser);

    });

    it("Should handle error when updating income amount", async () => {

        (axios.put as jest.Mock).mockRejectedValue(new Error("Error while updating income to the user"));

        await expect(updateIncomeAmount(user.username, "salary",200)).rejects.toThrow('Error while updating income to the user');
    });

    it("Should handle debit transaction for the user", async () => {
        const updatedUser = { ...user, transactions: [ { "id": 1, "type": "debit", "amount": 100, "category": "other",  "date": new Date("2024-09-05")}] };

        (axios.put as jest.Mock).mockResolvedValue({data: updatedUser});

        const response = await debitAmount(user.username, 100);

        expect(axios.put).toHaveBeenCalledWith(`http://localhost:4321/user/transaction/debit/${user.username}`, {amount: 100 });
        expect(response).toEqual(updatedUser);

    });

    it("Should handle error when handling debit transaction", async () => {

        (axios.put as jest.Mock).mockRejectedValue(new Error("Error while updating user"));

        await expect(debitAmount(user.username, 100)).rejects.toThrow('Error while updating user');
    });


    it("Should add a new budget for the user", async () => {
        user = { ...user, budgets: [{ category: "groceries", amount: 1000, amountSpent: 100 }] };

        (axios.put as jest.Mock).mockResolvedValue({data: user});

        const response = await addBudget(user.username, "groceries", 1000);

        expect(axios.put).toHaveBeenCalledWith(`http://localhost:4321/user/budget/${user.username}`, {category: "groceries",amount: 1000});
        expect(response).toEqual(user);

    });

    it("Should handle error when adding a budget", async () => {

        (axios.put as jest.Mock).mockRejectedValue(new Error("Error while inserting new budget to the user"));

        await expect(addBudget(user.username, "groceries", 1000)).rejects.toThrow('Error while inserting new budget to the user');
    });

    it("Should update budget amount for the user", async () => {
        user = { ...user, budgets: [{ category: "groceries", amount: 500, amountSpent: 100 }] };
        const updatedUser:IUser = { ...user, budgets: [{ category: "groceries", amount: 1000, amountSpent: 100 }], totalBudget:1500};
        (axios.put as jest.Mock).mockResolvedValue({data: updatedUser});

        const response: IUser = await updateBudgetAmount(user.username,  "groceries", 1000, 1500);

        expect(axios.put).toHaveBeenCalledWith(`http://localhost:4321/user/updatebudgetamount/${user.username}`, {
            category: "groceries",
            amount: 1000,
            totalBudget: 1500,
        });
        expect(response).toEqual(updatedUser);

    });

    it("Should handle error when updating budget amount", async () => {

        (axios.put as jest.Mock).mockRejectedValue(new Error("Error while updating user budget amount"));

        await expect(updateBudgetAmount(user.username,  "groceries", 1500, 1000,)).rejects.toThrow('Error while updating user budget amount');
    });

    it("Should add a savings goal for the user", async () => {
        const savingsGoal:ISavingsGoal = { title: "Emergency Fund", targetAmount: 5000, currentAmountSaved: 1000,};

        user = {...user, savingsGoals:[{title: "Emergency Fund",targetAmount: 5000, currentAmountSaved: 1000 }]};
        (axios.put as jest.Mock).mockResolvedValue({data:user});

        const response = await addSavingsGoal(user.username, savingsGoal);

        expect(axios.put).toHaveBeenCalledWith(`http://localhost:4321/user/savingsgoal/${user.username}`, savingsGoal);
        expect(response).toEqual(user);

    });

    it("Should handle error when adding a savings goal", async () => {
        const savingsGoal:ISavingsGoal = { title: "Emergency Fund", targetAmount: 5000, currentAmountSaved: 1000,};

        (axios.put as jest.Mock).mockRejectedValue(new Error("Error while adding savings goal to the user"));

        await expect(addSavingsGoal(user.username, savingsGoal)).rejects.toThrow('Error while adding savings goal to the user');
    });
    it("Should add amount to a savings goal for the user", async () => {

        user = {...user, savingsGoals:[{title: "Emergency Fund",targetAmount: 5000, currentAmountSaved: 1000 }]};
        const updatedUser:IUser = {...user, savingsGoals:[{title: "Emergency Fund",targetAmount: 5000, currentAmountSaved: 2000 }]};

        (axios.put as jest.Mock).mockResolvedValue({data:updatedUser});

       const response =  await addAmountToASavingsGoal(user.username, "Emergency Fund", 500);

        expect(axios.put).toHaveBeenCalledWith(`http://localhost:4321/user/savingsgoalamount/${user.username}`, {
            title: "Emergency Fund",
            amount: 500,
        });
        expect(response).toEqual(updatedUser);
    });

    it("Should handle error when adding amount to a savings goal", async () => {

        (axios.put as jest.Mock).mockRejectedValue(new Error("Error while adding amount to savings goal of the user"));

        await expect(addAmountToASavingsGoal(user.username, "Emergency Fund", 500)).rejects.toThrow('Error while adding amount to savings goal of the user');
    });

});