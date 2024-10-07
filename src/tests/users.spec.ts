import axios from 'axios';
import { IUser } from '../interfaces/user';
import { findUser, getUsers, insertUser, updateBudgetAmountSpent,  } from '../../backend/functions/users';
import { User } from '../classes/users';

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
        const updatedUser = { ...user, budgets: [{ category: "groceries", amount: 1000, amountSpent: 100 }] };
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

});