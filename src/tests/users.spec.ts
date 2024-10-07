import axios from 'axios';
import { IUser } from '../interfaces/user';
import { addBudget, addIncome, addSavingsGoal, addTransaction, debitTransaction, findUser, getUsers, insertUser, updateBudgetAmountSpent, updatebudgetampunt, updateIncomeAmount,  } from '../../backend/functions/users';
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
        const errorMessage = 'Error inserting user';
        (axios.post as jest.Mock).mockRejectedValue(new Error(errorMessage));
        
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
        const errorMessage = 'Error fetching users';
        (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));
        
        await expect(getUsers()).rejects.toThrow('Failed to fetch all users');
    });

    it("Should send a GET request to find a specific user", async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: user });
        
        const result = await findUser("abc", "abc");
        expect(axios.get).toHaveBeenCalledWith('http://localhost:4321/user', {params: { username: "abc", password: "abc" }});
        expect(result).toEqual(user);
    });

    it("Should handle error when finding a specific user", async () => {
        const errorMessage = 'Error finding user';
        (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));
        await expect(findUser("abc", "abc")).rejects.toThrow('Failed to find such user');
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

        const errorMessage = 'Error updating budget amount spent';
        (axios.put as jest.Mock).mockRejectedValue(new Error(errorMessage));

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

        const errorMessage = 'Error adding transaction';
        (axios.put as jest.Mock).mockRejectedValue(new Error(errorMessage));

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
        const errorMessage = 'Error adding income';
        (axios.put as jest.Mock).mockRejectedValue(new Error(errorMessage));
   
        await expect(addIncome(user.username, "salary",1000)).rejects.toThrow('Error while adding income user');
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
        const errorMessage = 'Error updating income amount';
        (axios.put as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await expect(updateIncomeAmount(user.username, "salary",200)).rejects.toThrow('Error while updating income user');
    });

    it("Should handle debit transaction for the user", async () => {
        const updatedUser = { ...user, transactions: [ { "id": 1, "type": "debit", "amount": 100, "category": "other",  "date": new Date("2024-09-05")}] };

        (axios.put as jest.Mock).mockResolvedValue({data: updatedUser});

        const response = await debitTransaction(user.username, 100);

        expect(axios.put).toHaveBeenCalledWith(`http://localhost:4321/user/transaction/debit/${user.username}`, {amount: 100 });
        expect(response).toEqual(updatedUser);

    });

    it("Should handle error when handling debit transaction", async () => {
        const errorMessage = 'Error handling debit transaction';
        (axios.put as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await expect(debitTransaction(user.username, 100)).rejects.toThrow('Error while updating user');
    });


    it("Should add a new budget for the user", async () => {
        user = { ...user, budgets: [{ category: "groceries", amount: 1000, amountSpent: 100 }] };

        (axios.put as jest.Mock).mockResolvedValue({data: user});

        const response = await addBudget(user.username, "groceries", 1000);

        expect(axios.put).toHaveBeenCalledWith(`http://localhost:4321/user/budget/${user.username}`, {category: "groceries",amount: 1000});
        expect(response).toEqual(user);

    });

    it("Should handle error when adding a budget", async () => {
        const errorMessage = 'Error adding budget';
        (axios.put as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await expect(addBudget(user.username, "groceries", 1000)).rejects.toThrow('Error while inserting new budget to the user');
    });

    it("Should update budget amount for the user", async () => {
        user = { ...user, budgets: [{ category: "groceries", amount: 500, amountSpent: 100 }] };
        const updatedUser:IUser = { ...user, budgets: [{ category: "groceries", amount: 1000, amountSpent: 100 }], totalBudget:1500};
        (axios.put as jest.Mock).mockResolvedValue({data: updatedUser});

        const response: IUser = await updatebudgetampunt(user.username,  "groceries", 1000, 1500);

        expect(axios.put).toHaveBeenCalledWith(`http://localhost:4321/user/updatebudgetampunt/${user.username}`, {
            category: "groceries",
            amount: 1000,
            totalBudget: 1500,
        });
        expect(response).toEqual(updatedUser);

    });

    it("Should handle error when updating budget amount", async () => {
        const errorMessage = 'Error updating budget amount';
        (axios.put as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await expect(updatebudgetampunt(user.username,  "groceries", 1500, 1000,)).rejects.toThrow('Error while updating user budget amount');
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

        const errorMessage = 'Error adding savings goal';
        (axios.put as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await expect(addSavingsGoal(user.username, savingsGoal)).rejects.toThrow('Error while adding savings goal to the user');
    });



});