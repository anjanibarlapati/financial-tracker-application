
import { Request, Response } from 'express';
import { addBudget, addIncome, addSavingsGoal, addTransaction, createUser, isExistingUser, debitAmount, getAllUsers, getUser, updateBudgetAmount, updateBudgetAmountSpent, updateIncomeAmount, updateSavingsGoalAmount, registerUser, loginUser, addTransactionHandler, addBudgetHandler, addSavingsGoalHandler, generateTotalIncomeAndExpenses, generateBudgetSummary, generateSavingsGoalsProgressReport } from '../controllers/usersRoutesHandler';
import { User } from '../models/users';
import { IUser } from '../interfaces/user';
import { User as UserClass } from '../classes/users';
import { register } from '../functions/registration';
import { login } from '../functions/login';
import { ITransaction } from '../interfaces/transactions';
import { ISavingsGoal } from '../interfaces/savingsGoals';
import { IFinancialReportBudget, IFinancialReportSavingsGoal } from '../interfaces/financialReport';

jest.mock('../models/users');
jest.mock('../functions/registration', () => ({
    register: jest.fn(),
}));

jest.mock('../functions/login', () => ({
    login: jest.fn(),
}));


describe('User Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

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

    beforeEach(() => {
        req = {
            body: {

            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a user and return it', async () => {
            req.body = user;
            const mockedUser = { id: 1, ...user };
            (User.create as jest.Mock).mockResolvedValue(mockedUser);

            await createUser(req as Request, res as Response);

            expect(User.create).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockedUser);
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should handle errors and respond with status 500', async () => {
            (User.create as jest.Mock).mockRejectedValue(new Error("Error while inserting user"));

            await createUser(req as Request, res as Response);

            expect(User.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while inserting user' });
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [user];
            (User.find as jest.Mock).mockResolvedValue(mockUsers);

            await getAllUsers(req as Request, res as Response);

            expect(User.find).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(mockUsers);
        });

        it('should handle errors if fetching all users fails', async () => {
            (User.find as jest.Mock).mockRejectedValue(new Error('Error while fetching all users'));

            await getAllUsers(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while fetching all users' });
        });
    });

    describe('getUser', () => {
        it('should return a user by username and password', async () => {
            req.query = { username: 'abc', password: 'abc' };
            const mockedUser = user;
            (User.findOne as jest.Mock).mockResolvedValue(mockedUser);

            await getUser(req as Request, res as Response);

            expect(User.findOne).toHaveBeenCalledWith({ username: req.query.username, password: req.query.password });
            expect(res.json).toHaveBeenCalledWith(mockedUser);
        });

        it('should handle errors if fetching a user fails', async () => {
            (User.findOne as jest.Mock).mockRejectedValue(new Error('Error while getting user'));

            await getUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while getting user' });
        });
    });

    describe('isExistingUser', () => {
        it('should return a user if given username already exist', async () => {
            req.params = { username: 'abc' };
            const mockedUser = user;
            (User.findOne as jest.Mock).mockResolvedValue(mockedUser);

            await isExistingUser(req as Request, res as Response);

            expect(User.findOne).toHaveBeenCalledWith({ username: req.params.username });
            expect(res.json).toHaveBeenCalledWith(mockedUser);
        });

        it('should handle errors if fetching a user fails', async () => {
            (User.findOne as jest.Mock).mockRejectedValue(new Error('Error while getting user'));

            await isExistingUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while getting user' });
        });
    });

    describe('updateBudgetAmountSpent', () => {
        it('should update budget amount spent', async () => {
            req.params = { username: 'abc' };
            req.body = { category: 'groceries', amount: 50 };
            const mockedResult = { ...user, budgets: { category: 'groceries', amount: 50, amountSpent: 0 } };
            (User.findOneAndUpdate as jest.Mock).mockResolvedValue(mockedResult);

            await updateBudgetAmountSpent(req as Request, res as Response);

            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { username: req.params.username, "budgets.category": req.body.category },
                { $inc: { "budgets.$.amountSpent": req.body.amount } },
                { new: true }
            );
            expect(res.json).toHaveBeenCalledWith(mockedResult);
        });

        it('should handle errors', async () => {
            (User.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Error while updating budget amount spent for the user'));

            await updateBudgetAmountSpent(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while updating budget amount spent for the user' });
        });
    });

    describe('addTransaction', () => {
        it('should add a transaction', async () => {
            req.params = { username: 'user1' };
            req.body = { id: 1, type: "credit", amount: 5000, category: "Others", date: new Date() };
            const mockedResult = { ...user, transactions: { id: 1, type: "credit", amount: 5000, category: "Others", date: "2024-09-05T00:00:00.000Z" } };
            (User.findOneAndUpdate as jest.Mock).mockResolvedValue(mockedResult);

            await addTransaction(req as Request, res as Response);

            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { username: req.params.username },
                { $push: { transactions: req.body } },
                { new: true }
            );
            expect(res.json).toHaveBeenCalledWith(mockedResult);
        });

        it('should handle errors', async () => {
            (User.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Error while inserting new transaction for the user'));

            await addTransaction(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while inserting new transaction for the user' });
        });
    });

    describe('addIncome', () => {
        it('should add income', async () => {
            req.params = { username: 'user1' };
            req.body = { category: 'salary', amount: 2000 };
            const mockedResult = { message: "Income added successfully" };
            (User.findOneAndUpdate as jest.Mock).mockResolvedValue(mockedResult);

            await addIncome(req as Request, res as Response);

            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { username: req.params.username },
                {
                    $push: { income: { source: req.body.category, amount: req.body.amount } },
                    $inc: { availableBalance: req.body.amount, totalIncome: req.body.amount },

                },
                { new: true }
            );
            expect(res.json).toHaveBeenCalledWith({ message: 'Income added successfully' });
        });

        it('should handle errors', async () => {
            (User.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Error while adding income to user'));

            await addIncome(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while adding income to user' });
        });
    });

    describe('updateIncomeAmount', () => {
        it('should update income amount', async () => {
            req.params = { username: 'user1' };
            req.body = { category: 'salary', amount: 500 };
            const mockedResult = { ...user, income: { source: "salary", amount: 2500 } };
            (User.findOneAndUpdate as jest.Mock).mockResolvedValue(mockedResult);

            await updateIncomeAmount(req as Request, res as Response);

            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { username: req.params.username, 'income.source': req.body.category },
                {
                    $inc: { 'income.$.amount': req.body.amount, availableBalance: req.body.amount, totalIncome: req.body.amount }
                },
                { new: true }
            );
            expect(res.json).toHaveBeenCalledWith(mockedResult);
        });

        it('should handle errors', async () => {
            (User.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Error while updating income to the user'));

            await updateIncomeAmount(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while updating income to the user' });
        });
    });

    describe('debitTransaction', () => {
        it('should debit an amount from user balance', async () => {
            req.params = { username: 'user1' };
            req.body = { amount: 100 };
            const mockResult = { ...user, availableBalance: 4400 };
            (User.findOneAndUpdate as jest.Mock).mockResolvedValue(mockResult);

            await debitAmount(req as Request, res as Response);

            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { username: req.params.username },
                { $inc: { availableBalance: -req.body.amount } },
                { new: true }
            );
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle errors', async () => {
            (User.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Error while updating user'));

            await debitAmount(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while updating user' });
        });
    });

    describe('addBudget', () => {
        it('should add a budget', async () => {
            req.params = { username: 'user1' };
            req.body = { category: 'food', amount: 300 };
            const mockResult = { ...user, budgets: { category: 'food', amount: 300 } };
            (User.findOneAndUpdate as jest.Mock).mockResolvedValue(mockResult);

            await addBudget(req as Request, res as Response);

            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { username: req.params.username },
                {
                    $push: { budgets: { category: req.body.category, amount: req.body.amount, amountSpent: 0 } },
                    $inc: { totalBudget: req.body.amount }
                },
                { new: true }
            );
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle errors', async () => {
            (User.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Error while inserting new budget to the user'));

            await addBudget(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while inserting new budget to the user' });
        });
    });

    describe('updateBudgetAmount', () => {
        it('should update budget amount', async () => {
            req.params = { username: 'user1' };
            req.body = { category: 'food', totalBudget: 200, amount: 200 };
            const mockResult = { ...user, budgets: { category: 'food', amount: 200, amountSpent: 0 }, totalBudget: 200 };
            (User.findOneAndUpdate as jest.Mock).mockResolvedValue(mockResult);

            await updateBudgetAmount(req as Request, res as Response);

            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { username: req.params.username, "budgets.category": req.body.category },
                {
                    $set: { totalBudget: req.body.totalBudget, "budgets.$.amount": req.body.amount }
                },
                { new: true }
            );
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle errors if updating budget amount for the user fails', async () => {
            (User.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Error while updating budget amount for the user'));

            await updateBudgetAmount(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while updating budget amount for the user' });
        });
    });

    describe('addSavingsGoal', () => {
        it('should add a savings goal', async () => {
            req.params = { username: 'user1' };
            req.body = { title: 'vacation', amount: 1000 };
            const mockResult = { ...user, savingsGoals: { title: 'vacation', amount: 1000 } };
            (User.findOneAndUpdate as jest.Mock).mockResolvedValue(mockResult);

            await addSavingsGoal(req as Request, res as Response);

            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { username: req.params.username },
                {
                    $push: { savingsGoals: req.body },
                },
                { new: true }
            );
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle errors', async () => {
            (User.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Error while inserting new savings goal to the user'));

            await addSavingsGoal(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while inserting new savings goal to the user' });
        });
    });

    describe('updateSavingsGoalAmount', () => {
        it('should update savings goal amount', async () => {
            req.params = { username: 'user1' };
            req.body = { title: 'vacation', amount: 300 };
            const mockResult = { ...user, savingsGoals: { title: 'vacation', amount: 1000, currentAmountSaved: 300 } };
            (User.findOneAndUpdate as jest.Mock).mockResolvedValue(mockResult);

            await updateSavingsGoalAmount(req as Request, res as Response);

            expect(User.findOneAndUpdate).toHaveBeenCalledWith(
                { username: req.params.username, "savingsGoals.title": req.body.title },
                { $inc: { "savingsGoals.$.currentAmountSaved": req.body.amount, availableBalance: req.body.amount } },
                { new: true }
            );
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle errors', async () => {
            (User.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Error while updating savings goal amount saved of the user'));

            await updateSavingsGoalAmount(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while updating savings goal amount saved of the user' });
        });
    });

    describe('register user', () => {
        beforeEach(() => {
            req.body = {
                username: user.username,
                password: user.password,
            };
            jest.clearAllMocks();
        })

        it('should register a user and return it', async () => {

            const mockedUser = new UserClass(user.username, user.password);
            (register as jest.Mock).mockResolvedValue(mockedUser);

            await registerUser(req as Request, res as Response);

            expect(register).toHaveBeenCalledWith(user.username, user.password);
            expect(res.json).toHaveBeenCalledWith(mockedUser);
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should handle errors and respond with status 500', async () => {
            (register as jest.Mock).mockRejectedValue(new Error("Error while registering user"));

            await registerUser(req as Request, res as Response);

            expect(register).toHaveBeenCalledWith(user.username, user.password);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while registering user' });
        });
    });

    describe('login user', () => {
        beforeEach(() => {
            req.query = {
                username: user.username,
                password: user.password,
            };
            jest.clearAllMocks();
        })

        it('should login a user and return it', async () => {

            const mockedUser = new UserClass(user.username, user.password);
            (login as jest.Mock).mockResolvedValue(mockedUser);

            await loginUser(req as Request, res as Response);

            expect(login).toHaveBeenCalledWith(user.username, user.password);
            expect(res.json).toHaveBeenCalledWith(mockedUser);
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should handle errors while login and respond with status 500', async () => {
            (login as jest.Mock).mockRejectedValue(new Error("Error while user login in"));

            await loginUser(req as Request, res as Response);

            expect(login).toHaveBeenCalledWith(user.username, user.password);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while user login in' });
        });
    });

    
    describe("Add Transaction Handler", () => {
        let mockTransaction: ITransaction = {
            id: 1,
            amount: 100,
            type: "credit",
            date: new Date("2024-10-22"),
            category: "Groceries",
        };

        let user: UserClass;

        beforeEach(() => {
            user = new UserClass("abc", "abc"); 
            jest.clearAllMocks();
        });

        it("Should add a new transaction and return user", async () => {
            req.body = mockTransaction;

            const mockedAddTransaction = jest.spyOn(UserClass.prototype, 'transaction').mockImplementation(async () => { return ''});

            await addTransactionHandler(req as Request, res as Response);

            expect(mockedAddTransaction).toHaveBeenCalledWith(mockTransaction);
            expect(res.json).toHaveBeenCalledWith(user);
            mockedAddTransaction.mockRestore();

        });

        it("Should handle error when adding a transaction", async () => {
            req.body = mockTransaction;

            const mockedAddTransaction = jest.spyOn(UserClass.prototype, 'transaction').mockRejectedValue(new Error("Error while adding transaction"));

            await addTransactionHandler(req as Request, res as Response);

            expect(mockedAddTransaction).toHaveBeenCalledWith(mockTransaction);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while adding transaction' });
            mockedAddTransaction.mockRestore();

        });
    });

    describe("Add Budget Handler", () => {
        let mockBudget = {
            category: "Groceries",
            amount: "200"
        };
    
        let user: UserClass;
    
        beforeEach(() => {
            user = new UserClass("abc", "abc"); 
            jest.clearAllMocks();
        });
    
        it("Should add a new budget and return user", async () => {
            req.body = mockBudget;
    
            const mockedSetBudget = jest.spyOn(UserClass.prototype, 'setBudget').mockImplementation(async () => {});
    
            await addBudgetHandler(req as Request, res as Response);
    
            expect(mockedSetBudget).toHaveBeenCalledWith(mockBudget.category, mockBudget.amount);
            expect(res.json).toHaveBeenCalledWith(user);
            mockedSetBudget.mockRestore();
        });
    
        it("Should handle error when adding a budget", async () => {
            req.body = mockBudget;
    
            const mockedSetBudget = jest.spyOn(UserClass.prototype, 'setBudget').mockRejectedValue(new Error("Error while adding budget"));
    
            await addBudgetHandler(req as Request, res as Response);
    
            expect(mockedSetBudget).toHaveBeenCalledWith(mockBudget.category, mockBudget.amount);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while adding budget' });
            mockedSetBudget.mockRestore();
        });
    });

    describe("Add Savings Goal Handler", () => {
        let mockSavingsGoal:ISavingsGoal = {
            title: "Emergency Fund",
            targetAmount: 1000,
            currentAmountSaved: 0,
        };
    
        let user: UserClass;
    
        beforeEach(() => {
            user = new UserClass("abc", "abc"); 
            jest.clearAllMocks();
        });
    
        it("Should add a new savings goal and return user", async () => {
            req.body = mockSavingsGoal;
    
            const mockedAddSavingsGoal = jest.spyOn(UserClass.prototype, 'addSavingsGoal').mockImplementation(async () => {});
    
            await addSavingsGoalHandler(req as Request, res as Response);
    
            expect(mockedAddSavingsGoal).toHaveBeenCalledWith(mockSavingsGoal);
            expect(res.json).toHaveBeenCalledWith(user);
            mockedAddSavingsGoal.mockRestore();
        });
    
        it("Should handle error when adding a savings goal", async () => {
            req.body = mockSavingsGoal;
    
            const mockedAddSavingsGoal = jest.spyOn(UserClass.prototype, 'addSavingsGoal').mockRejectedValue(new Error("Error while adding savings goal"));
    
            await addSavingsGoalHandler(req as Request, res as Response);
    
            expect(mockedAddSavingsGoal).toHaveBeenCalledWith(mockSavingsGoal);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while adding savings goal' });
            mockedAddSavingsGoal.mockRestore();
        });
    });

    describe("Generate Total Income and Expenses Handler", () => {
        let user: UserClass;
    
        beforeEach(() => {
            req = {
                query: {
                    fromDate: "2024-01-01",
                    toDate: "2024-01-31",
                },
            };
            user = new UserClass("abc", "abc");
            jest.clearAllMocks();
        });
    
        it("Should generate total income and expenses and return the report", async () => {
            const mockReport = {
                totalIncome: 5000,
                totalExpenses: 2000,
            };
    
            jest.spyOn(UserClass.prototype, 'totalIncomeAndExpenses').mockReturnValue(mockReport);
    
            await generateTotalIncomeAndExpenses(req as Request, res as Response);
    
            expect(user.totalIncomeAndExpenses).toHaveBeenCalledWith(new Date("2024-01-01"), new Date("2024-01-31"));
            expect(res.json).toHaveBeenCalledWith(mockReport);
        });
    
        it("Should handle error when generating total income and expenses", async () => {
    
            jest.spyOn(UserClass.prototype, 'totalIncomeAndExpenses').mockImplementation(() => {
                throw new Error("Error while generating total income and expenses report of the user");
            });
            await generateTotalIncomeAndExpenses(req as Request, res as Response);
    
            expect(user.totalIncomeAndExpenses).toHaveBeenCalledWith(new Date("2024-01-01"), new Date("2024-01-31"));
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while generating total income and expenses report of the user' });
        });
    });

    describe("Generate Budget Summary Handler", () => {
;
        let user: UserClass;
    
        beforeEach(() => {
            req = {
                query: {
                    fromDate: "2024-01-01",
                    toDate: "2024-01-31",
                },
            };
            user = new UserClass("abc", "abc");
            jest.clearAllMocks();
        });
    
        it("Should generate budget summary and return the report", async () => {
            const mockReport: IFinancialReportBudget[] = [
                { category: 'Travel', amount: 1000, amountSpent: 350 },
                { category: 'Groceries', amount: 10000, amountSpent: 3800 },
                { category: 'Entertainment', amount: 5000, amountSpent: 700 }
            ]
        
    
            jest.spyOn(UserClass.prototype, 'budgetSummary').mockReturnValue(mockReport);
    
            await generateBudgetSummary(req as Request, res as Response);
    
            expect(user.budgetSummary).toHaveBeenCalledWith(new Date("2024-01-01"), new Date("2024-01-31"));
            expect(res.json).toHaveBeenCalledWith(mockReport);
        });
    
        it("Should handle error when generating budget summary", async () => {
            jest.spyOn(UserClass.prototype, 'budgetSummary').mockImplementation(() => {
                throw new Error("Error while generating budget summary report of the user");
            });
    
            await generateBudgetSummary(req as Request, res as Response);
    
            expect(user.budgetSummary).toHaveBeenCalledWith(new Date("2024-01-01"), new Date("2024-01-31"));
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while generating budget summary report of the user' });
        });
    });

    describe("Generate Savings Goals Progress Report Handler", () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let user: UserClass;
    
        beforeEach(() => {
            req = {
                query: {
                    fromDate: "2024-01-01",
                    toDate: "2024-01-31",
                },
            };
            user = new UserClass("abc", "abc");
            res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };
            jest.clearAllMocks();
        });
    
        it("Should generate savings goals progress report and return the report", async () => {
            const mockReport: IFinancialReportSavingsGoal[] = [
                { title: 'Travel', targetAmount: 2000, currentAmountSaved: 500, progress: '25.0%' },
                { title: 'Home', targetAmount: 5000, currentAmountSaved: 600, progress: '12.0%' },
                { title: 'Emergency Fund', targetAmount: 1000, currentAmountSaved: 950, progress: '95.0%' }
            ]
    
            jest.spyOn(UserClass.prototype, 'savingsGoalsProgress').mockReturnValue(mockReport);
    
            await generateSavingsGoalsProgressReport(req as Request, res as Response);
    
            expect(user.savingsGoalsProgress).toHaveBeenCalledWith(new Date("2024-01-01"), new Date("2024-01-31"));
            expect(res.json).toHaveBeenCalledWith(mockReport);
        });
    
        it("Should handle error when generating savings goals progress report", async () => {
            jest.spyOn(UserClass.prototype, 'savingsGoalsProgress').mockImplementation(() => {
                throw new Error("Error while generating savings goals progress report of the user");
            });
    
            await generateSavingsGoalsProgressReport(req as Request, res as Response);
    
            expect(user.savingsGoalsProgress).toHaveBeenCalledWith(new Date("2024-01-01"), new Date("2024-01-31"));
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while generating savings goals progress report of the user' });
        });
    });
    
});

