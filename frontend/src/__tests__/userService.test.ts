import axios from "axios";
import { addBudget, addSavingsGoal, addTransaction, generateBudgetSummary, generateSavingsGoalsProgressReport, generateTotalIncomeAndExpenses, loginUser, registerUser } from "../services/user";
import { ITransaction } from "../interfaces/transactions";
import { IBudget } from "../interfaces/budget";
import { ISavingsGoal } from "../interfaces/savingsGoals";
import { IFinancialReportBudget, IFinancialReportSavingsGoal } from "../interfaces/financialReport";

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
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("Should register a new user into the database", async () => {
        (axios.post as jest.Mock).mockResolvedValue({ data: user });
        const response = await registerUser("a", "a");
        expect(axios.post).toHaveBeenCalledWith('http://localhost:4321/register/user', { username: "a", password: "a" });
        expect(response).toEqual(user);
    });

    it("Should handle error when registering a new user", async () => {

        (axios.post as jest.Mock).mockRejectedValue(new Error("Failed to insert user"));

        await expect(registerUser("a", "a")).rejects.toThrow('Failed to register user');
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
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("Should register a new user into the database", async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: user });
        const response = await loginUser("a", "a");
        expect(axios.get).toHaveBeenCalledWith('http://localhost:4321/login/user', { params: { username: "a", password: "a" } });
        expect(response).toEqual(user);
    });

    it("Should handle error when registering a new user", async () => {

        (axios.get as jest.Mock).mockRejectedValue(new Error("Failed to find user"));

        await expect(loginUser("a", "a")).rejects.toThrow('Failed to login user');
    });
});

describe("Add Transaction Route", () => {
    let transaction: ITransaction = {
        id: 1,
        amount: 100,
        type: "credit",
        date: new Date("2024-10-22"),
        category: "Groceries",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should add a new transaction", async () => {
        (axios.put as jest.Mock).mockResolvedValue({ data: transaction });

        const response = await addTransaction(transaction);
        expect(axios.put).toHaveBeenCalledWith('http://localhost:4321/addTransaction/', transaction);
        expect(response).toEqual(transaction);
    });

    it("Should handle error when adding a new transaction", async () => {
        (axios.put as jest.Mock).mockRejectedValue(new Error("Error while inserting new transaction for the user"));

        await expect(addTransaction(transaction)).rejects.toThrow('Error while inserting new transaction for the user');
    });
});

describe("Add Budget Route", () => {
    const budget: IBudget = {
        category: "Groceries",
        amount: 200,
        amountSpent: 0
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should add a new budget", async () => {
        (axios.put as jest.Mock).mockResolvedValue({ data: budget });

        const response = await addBudget(budget.category, budget.amount);
        expect(axios.put).toHaveBeenCalledWith('http://localhost:4321/addBudget/', { category: budget.category, amount: budget.amount });
        expect(response).toEqual(budget);
    });

    it("Should handle error when adding a new budget", async () => {
        (axios.put as jest.Mock).mockRejectedValue(new Error("Error while inserting new budget for the user"));

        await expect(addBudget(budget.category, budget.amount)).rejects.toThrow('Error while inserting new budget for the user');
    });
});

describe("Add Savings Goal Route", () => {
    const savingsGoal: ISavingsGoal = {
        title: "Emergency Fund",
        targetAmount: 1000,
        currentAmountSaved: 0,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should add a new savings goal", async () => {
        (axios.put as jest.Mock).mockResolvedValue({ data: savingsGoal });

        const response = await addSavingsGoal(savingsGoal);
        expect(axios.put).toHaveBeenCalledWith('http://localhost:4321/addSavingsGoal/', savingsGoal);
        expect(response).toEqual(savingsGoal);
    });

    it("Should handle error when adding a new savings goal", async () => {
        (axios.put as jest.Mock).mockRejectedValue(new Error("Error while inserting new savings goal for the user"));

        await expect(addSavingsGoal(savingsGoal)).rejects.toThrow('Error while inserting new savings goal for the user');
    });
});

describe("Generate Total Income and Expenses Route", () => {
    const fromDate = new Date("2024-01-01");
    const toDate = new Date("2024-01-31");
    const mockResponse = {
        totalIncome: 5000,
        totalExpenses: 2000,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should generate total income and expenses", async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: mockResponse });

        const response = await generateTotalIncomeAndExpenses(fromDate, toDate);
        expect(axios.get).toHaveBeenCalledWith('http://localhost:4321/generate/total-income-expenses', {
            params: { fromDate, toDate },
        });
        expect(response).toEqual(mockResponse);
    });

    it("Should handle error when generating total income and expenses", async () => {
        (axios.get as jest.Mock).mockRejectedValue(new Error("Error while generating total income and expenses report of the user"));

        await expect(generateTotalIncomeAndExpenses(fromDate, toDate)).rejects.toThrow('Error while generating total income and expenses report of the user');
    });
});

describe("Generate Budget Summary Route", () => {
    const fromDate = new Date("2024-01-01");
    const toDate = new Date("2024-01-31");
    const report: IFinancialReportBudget[] = [
        { category: 'Travel', amount: 1000, amountSpent: 350 },
        { category: 'Groceries', amount: 10000, amountSpent: 3800 },
        { category: 'Entertainment', amount: 5000, amountSpent: 700 }
    ]

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should generate budget summary", async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: report });

        const response = await generateBudgetSummary(fromDate, toDate);
        expect(axios.get).toHaveBeenCalledWith('http://localhost:4321/generate/budget-summary', {
            params: { fromDate, toDate },
        });
        expect(response).toEqual(report);
    });

    it("Should handle error when generating budget summary", async () => {
        (axios.get as jest.Mock).mockRejectedValue(new Error("Error while generating budget summary report of the user"));

        await expect(generateBudgetSummary(fromDate, toDate)).rejects.toThrow('Error while generating budget summary report of the user');
    });
});

describe("Generate Savings Goals Progress Report Route", () => {
    const fromDate = new Date("2024-01-01");
    const toDate = new Date("2024-01-31");
    const report: IFinancialReportSavingsGoal[] = [
        { title: 'Travel', targetAmount: 2000, currentAmountSaved: 500, progress: '25.0%' },
        { title: 'Home', targetAmount: 5000, currentAmountSaved: 600, progress: '12.0%' },
        { title: 'Emergency Fund', targetAmount: 1000, currentAmountSaved: 950, progress: '95.0%' }
    ]

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Should generate savings goals progress report", async () => {
        (axios.get as jest.Mock).mockResolvedValue({ data: report });

        const response = await generateSavingsGoalsProgressReport(fromDate, toDate);
        expect(axios.get).toHaveBeenCalledWith('http://localhost:4321/generate/savings-goals-progress', {
            params: { fromDate, toDate },
        });
        expect(response).toEqual(report);
    });

    it("Should handle error when generating savings goals progress report", async () => {
        (axios.get as jest.Mock).mockRejectedValue(new Error("Error while generating savings goals progress report of the user"));

        await expect(generateSavingsGoalsProgressReport(fromDate, toDate)).rejects.toThrow('Error while generating savings goals progress report of the user');
    });
});



