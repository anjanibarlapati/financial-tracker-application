import axios from 'axios';
import { IUser } from '../interfaces/user';
import { insertUser } from '../../backend/functions/users';
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


});
