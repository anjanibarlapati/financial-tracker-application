import express from 'express';
import {
    createUser, getAllUsers, getUser, updateBudgetAmountSpent, addTransaction, addIncome, updateIncomeAmount, 
    debitTransaction, addBudget, updateBudgetAmount, addSavingsGoal, updateSavingsGoalAmount
} from '../functions/usersRoutesHandler';

export const userRouter = express.Router();

userRouter.post('/user', createUser);

userRouter.get('/users', getAllUsers);

userRouter.get('/user', getUser);

userRouter.put('/user/budgetamountspent/:username', updateBudgetAmountSpent);

userRouter.put('/user/transaction/:username', addTransaction);

userRouter.put('/user/income/:username', addIncome);

userRouter.put('/user/incomeamount/:username', updateIncomeAmount);

userRouter.put('/user/transaction/debit/:username', debitTransaction);

userRouter.put('/user/budget/:username', addBudget);

userRouter.put('/user/updatebudgetampunt/:username', updateBudgetAmount);

userRouter.put('/user/savingsgoal/:username', addSavingsGoal);

userRouter.put('/user/savingsgoalamount/:username', updateSavingsGoalAmount);

