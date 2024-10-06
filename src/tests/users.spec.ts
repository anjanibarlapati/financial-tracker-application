import axios from 'axios';
import { IUser } from '../interfaces/user';
import { findUser, getUsers, insertUser } from '../../backend/functions/users';
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

    it("Should insert a new user into the database", async () => {
        (axios.post as jest.Mock).mockResolvedValue(user);
        await insertUser(user as User);
        expect(axios.post).toHaveBeenCalledWith('http://localhost:4321/user', user);
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
        
        await expect(getUsers()).rejects.toThrow('Failed to fetch users');
    });

    it("Should send a GET request to find a specific user", async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: user });
        
        const result = await findUser("abc", "abc");
        
        expect(axios.get).toHaveBeenCalledWith('http://localhost:4321/user', {
            params: { username: "abc", password: "abc" }
        });
        expect(result).toEqual(user);
    });

    it("Should handle error when finding a specific user", async () => {
        const errorMessage = 'Error finding user';
        (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));
        await expect(findUser("abc", "abc")).rejects.toThrow('Failed to find user');
    });
});
