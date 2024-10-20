import axios from "axios";
import { loginUser, registerUser } from "../services/user";

jest.mock('axios');

describe("Register Route", () => {
    let user = {
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

    it("Should register a new user into the database", async () => {
        (axios.post as jest.Mock).mockResolvedValue({data:user});
        const response = await registerUser("a","a");
        expect(axios.post).toHaveBeenCalledWith('http://localhost:4321/register/user', {username:"a", password:"a"});
        expect(response).toEqual(user);
    });

    it("Should handle error when registering a new user", async () => {

        (axios.post as jest.Mock).mockRejectedValue(new Error("Failed to insert user"));
        
        await expect(registerUser("a","a")).rejects.toThrow('Failed to register user');
    });
});

describe("Login Route", () => {
    let user = {
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

    it("Should register a new user into the database", async () => {
        (axios.get as jest.Mock).mockResolvedValue({data:user});
        const response = await loginUser("a","a");
        expect(axios.get).toHaveBeenCalledWith('http://localhost:4321/login/user', {params:{username:"a", password:"a"}});
        expect(response).toEqual(user);
    });

    it("Should handle error when registering a new user", async () => {

        (axios.get as jest.Mock).mockRejectedValue(new Error("Failed to find user"));
        
        await expect(loginUser("a","a")).rejects.toThrow('Failed to login user');
    });
});