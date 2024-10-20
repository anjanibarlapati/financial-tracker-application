import express from 'express';

import {
    createUser, getAllUsers, getUser,isExistingUser,  updateBudgetAmountSpent, addTransaction, addIncome, updateIncomeAmount, 
    debitAmount, addBudget, updateBudgetAmount, addSavingsGoal, updateSavingsGoalAmount,
    registerUser,
    loginUser
} from '../controllers/usersRoutesHandler';

export const userRouter = express.Router();

userRouter.post('/user', createUser);

userRouter.get('/users', getAllUsers);

userRouter.get('/user', getUser);

userRouter.get('/user/:username', isExistingUser);

userRouter.put('/user/budgetamountspent/:username', updateBudgetAmountSpent);

userRouter.put('/user/transaction/:username', addTransaction);

userRouter.put('/user/income/:username', addIncome);

userRouter.put('/user/incomeamount/:username', updateIncomeAmount);

userRouter.put('/user/transaction/debit/:username', debitAmount);

userRouter.put('/user/budget/:username', addBudget);

userRouter.put('/user/updatebudgetamount/:username', updateBudgetAmount);

userRouter.put('/user/savingsgoal/:username', addSavingsGoal);

userRouter.put('/user/savingsgoalamount/:username', updateSavingsGoalAmount);

userRouter.post('/register/user', registerUser);

userRouter.get('/login/user', loginUser);


