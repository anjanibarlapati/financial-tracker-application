
import { Request, Response } from 'express';
import { addBudget, addIncome, addSavingsGoal, addTransaction, createUser, debitTransaction, getAllUsers, getUser, updateBudgetAmount, updateBudgetAmountSpent, updateIncomeAmount, updateSavingsGoalAmount } from '../../backend/functions/usersRoutesHandler';
import { User } from '../../backend/models/users';
import { IUser } from '../interfaces/user';

jest.mock('../../backend/models/users'); 


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
            body:{

            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    describe('createUser', () => {
        it('should create a user and return it', async () => {
            const mockUser = { id: 1, ...req.body };
            (User.create as jest.Mock).mockResolvedValue(mockUser); 
    
            await createUser(req as Request, res as Response);
    
            expect(User.create).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(mockUser);
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
            req.body = {username: "a", password: "a123"};
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
            const mockUser = user;
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await getUser(req as Request, res as Response);

            expect(User.findOne).toHaveBeenCalledWith({ username: req.query.username, password: req.query.password });
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('should handle errors if fetching a user fails', async () => {
            (User.findOne as jest.Mock).mockRejectedValue(new Error('Error while getting user'));

            await getUser(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while getting user' });
        });
    });

    describe('updateBudgetAmountSpent', () => {
        it('should update budget amount spent', async () => {
            req.params = { username: 'abc' };
            req.body = { category: 'groceries', amount: 50 };
            const mockResult = { modifiedCount: 1 };
            (User.updateOne as jest.Mock).mockResolvedValue(mockResult);

            await updateBudgetAmountSpent(req as Request, res as Response);

            expect(User.updateOne).toHaveBeenCalledWith(
                { username: req.params.username, "budgets.category": req.body.category },
                { $inc: { "budgets.$.amountSpent": req.body.amount } }
            );
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle errors', async () => {
            (User.updateOne as jest.Mock).mockRejectedValue(new Error('Database error'));

            await updateBudgetAmountSpent(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while updating budget amount spent for the user' });
        });
    });

    describe('addTransaction', () => {
        it('should add a transaction', async () => {
            req.params = { username: 'user1' };
            req.body = { amount: 100 };
            const mockResult = { modifiedCount: 1 };
            (User.updateOne as jest.Mock).mockResolvedValue(mockResult);

            await addTransaction(req as Request, res as Response);

            expect(User.updateOne).toHaveBeenCalledWith(
                { username: req.params.username },
                { $push: { transactions: req.body } }
            );
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle errors', async () => {
            (User.updateOne as jest.Mock).mockRejectedValue(new Error('Database error'));

            await addTransaction(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while inserting new transaction for the user' });
        });
    });

    describe('addIncome', () => {
        it('should add income', async () => {
            req.params = { username: 'user1' };
            req.body = { category: 'salary', amount: 2000 };
            const mockResult = { modifiedCount: 1 };
            (User.updateOne as jest.Mock).mockResolvedValue(mockResult);

            await addIncome(req as Request, res as Response);

            expect(User.updateOne).toHaveBeenCalledWith(
                { username: req.params.username },
                {
                    $push: { income: { source: req.body.category, amount: req.body.amount } },
                    $inc: { availableBalance: req.body.amount, totalIncome: req.body.amount }
                }
            );
            expect(res.json).toHaveBeenCalledWith({ message: 'Income added successfully' });
        });

        it('should handle errors', async () => {
            (User.updateOne as jest.Mock).mockRejectedValue(new Error('Database error'));

            await addIncome(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while adding income to user' });
        });
    });

    describe('updateIncomeAmount', () => {
        it('should update income amount', async () => {
            req.params = { username: 'user1' };
            req.body = { category: 'salary', amount: 500 };
            const mockResult = { modifiedCount: 1 };
            (User.updateOne as jest.Mock).mockResolvedValue(mockResult);

            await updateIncomeAmount(req as Request, res as Response);

            expect(User.updateOne).toHaveBeenCalledWith(
                { username: req.params.username, 'income.source': req.body.category },
                {
                    $inc: { 'income.$.amount': req.body.amount, availableBalance: req.body.amount, totalIncome: req.body.amount }
                }
            );
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle errors', async () => {
            (User.updateOne as jest.Mock).mockRejectedValue(new Error('Database error'));

            await updateIncomeAmount(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while updating income user' });
        });
    });

    describe('debitTransaction', () => {
        it('should debit an amount from user balance', async () => {
            req.params = { username: 'user1' };
            req.body = { amount: 100 };
            const mockResult = { modifiedCount: 1 };
            (User.updateOne as jest.Mock).mockResolvedValue(mockResult);

            await debitTransaction(req as Request, res as Response);

            expect(User.updateOne).toHaveBeenCalledWith(
                { username: req.params.username },
                { $inc: { availableBalance: -req.body.amount } }
            );
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle errors', async () => {
            (User.updateOne as jest.Mock).mockRejectedValue(new Error('Database error'));

            await debitTransaction(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while updating user' });
        });
    });

    describe('addBudget', () => {
        it('should add a budget', async () => {
            req.params = { username: 'user1' };
            req.body = { category: 'food', amount: 300 };
            const mockResult = { modifiedCount: 1 };
            (User.updateOne as jest.Mock).mockResolvedValue(mockResult);

            await addBudget(req as Request, res as Response);

            expect(User.updateOne).toHaveBeenCalledWith(
                { username: req.params.username },
                {
                    $push: { budgets: { category: req.body.category, amount: req.body.amount, amountSpent: 0 } },
                    $inc: { totalBudget: req.body.amount }
                }
            );
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle errors', async () => {
            (User.updateOne as jest.Mock).mockRejectedValue(new Error('Database error'));

            await addBudget(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while inserting new budget to the user' });
        });
    });

    describe('updateBudgetAmount', () => {
        it('should update budget amount', async () => {
            req.params = { username: 'user1' };
            req.body = { category: 'food', totalBudget: 600, amount: 200 };
            const mockResult = { modifiedCount: 1 };
            (User.updateOne as jest.Mock).mockResolvedValue(mockResult);

            await updateBudgetAmount(req as Request, res as Response);

            expect(User.updateOne).toHaveBeenCalledWith(
                { username: req.params.username, "budgets.category": req.body.category },
                {
                    $set: { totalBudget: req.body.totalBudget },
                    $inc: { "budgets.$.amount": req.body.amount }
                }
            );
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle errors if updating budget amount for the user fails', async () => {
            (User.updateOne as jest.Mock).mockRejectedValue(new Error('Database error'));

            await updateBudgetAmount(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while updating budget amount for the user' });
        });
    });

    describe('addSavingsGoal', () => {
        it('should add a savings goal', async () => {
            req.params = { username: 'user1' };
            req.body = { title: 'vacation', amount: 1000 };
            const mockResult = { modifiedCount: 1 };
            (User.updateOne as jest.Mock).mockResolvedValue(mockResult);

            await addSavingsGoal(req as Request, res as Response);

            expect(User.updateOne).toHaveBeenCalledWith(
                { username: req.params.username },
                {
                    $push: { savingsGoals: req.body },
                }
            );
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle errors', async () => {
            (User.updateOne as jest.Mock).mockRejectedValue(new Error('Database error'));

            await addSavingsGoal(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while inserting new savings goal to the user' });
        });
    });

    describe('updateSavingsGoalAmount', () => {
        it('should update savings goal amount', async () => {
            req.params = { username: 'user1' };
            req.body = { category: 'vacation', amount: 300 };
            const mockResult = { modifiedCount: 1 };
            (User.updateOne as jest.Mock).mockResolvedValue(mockResult);

            await updateSavingsGoalAmount(req as Request, res as Response);

            expect(User.updateOne).toHaveBeenCalledWith(
                { username: req.params.username, "savingsGoals.title": req.body.category },
                { $inc: { "savingsGoals.$.currentAmountSaved": req.body.amount } }
            );
            expect(res.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle errors', async () => {
            (User.updateOne as jest.Mock).mockRejectedValue(new Error('Database error'));

            await updateSavingsGoalAmount(req as Request, res as Response);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error while updating savings goal amount saved of the user' });
        });
    });
});

