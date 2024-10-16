import { Request, Response } from 'express';
import { User } from '../models/users';

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error while inserting user' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching all users' });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ username: req.query.username, password: req.query.password });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error while getting user' });
    }
};

export const isExistingUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ username: req.params.username});
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error while getting user' });
    }
};

export const updateBudgetAmountSpent = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { username: req.params.username, "budgets.category": req.body.category },
            { $inc: { "budgets.$.amountSpent": req.body.amount }},
            {new:true}
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error while updating budget amount spent for the user' });
    }
};

export const addTransaction = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { username: req.params.username },
            { $push: { transactions: req.body } },
            {new:true}
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error while inserting new transaction for the user' });
    }
};

export const addIncome = async (req: Request, res: Response) => {
    try {
        await User.findOneAndUpdate(
            { username: req.params.username },
            {
                $push: { income: { source: req.body.category, amount: req.body.amount } },
                $inc: { availableBalance: req.body.amount, totalIncome: req.body.amount }
            },
            {new:true}
        );
        res.json({ message: 'Income added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error while adding income to user' });
    }
};

export const updateIncomeAmount = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { username: req.params.username, 'income.source': req.body.category },
            {
                $inc: { 'income.$.amount': req.body.amount, availableBalance: req.body.amount, totalIncome: req.body.amount }
            },
            {new:true}
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error while updating income to the user' });
    }
};

export const debitAmount = async (req: Request, res: Response) => {
    try {
        const user = await User.findOneAndUpdate(
            { username: req.params.username },
            {
                $inc: { availableBalance: -req.body.amount }
            },
            {new:true}
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error while updating user' });
    }
};

export const addBudget = async (req: Request, res: Response) => {
    try {
        const result = await User.findOneAndUpdate(
            { username: req.params.username },
            {
                $push: { budgets: { category: req.body.category, amount: req.body.amount, amountSpent: 0 } },
                $inc: { totalBudget: req.body.amount }
            },
            {new:true}
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error while inserting new budget to the user' });
    }
};

export const updateBudgetAmount = async (req: Request, res: Response) => {
    try {
        const result = await User.findOneAndUpdate(
            { username: req.params.username, "budgets.category": req.body.category },
            {
                $set: { totalBudget: req.body.totalBudget, "budgets.$.amount": req.body.amount}
            },
            {new:true}
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error while updating budget amount for the user' });
    }
};

export const addSavingsGoal = async (req: Request, res: Response) => {
    try {
        const result = await User.findOneAndUpdate(
            { username: req.params.username },
            {
                $push: { savingsGoals: req.body },
            },
            {new:true}
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error while inserting new savings goal to the user' });
    }
};

export const updateSavingsGoalAmount = async (req: Request, res: Response) => {
    try {
        const result = await User.findOneAndUpdate(
            { username: req.params.username, "savingsGoals.title": req.body.title },
            { $inc: { "savingsGoals.$.currentAmountSaved": req.body.amount } },
            {new:true}
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error while updating savings goal amount saved of the user' });
    }
};
