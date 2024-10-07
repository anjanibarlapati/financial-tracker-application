import express, { Request, Response } from 'express';
import { User } from '../models/users';

export const userRouter = express.Router();

userRouter.post('/user', async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error while inserting user' });
  }
});

userRouter.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching all users' });
  }
})

userRouter.get('/user', async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username, password: req.params.password });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error while getting user' });
  }
});

userRouter.put('/user/budgetamountspent/:username', async (req: Request, res: Response) => {
  try {
    const user = await User.updateOne(
      { username: req.params.username, "budgets.category": req.body.category },
      { $inc: { "budgets.$.amountSpent": req.body.amount } }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error while updating  budget amount spent for the user' });
  }
})

userRouter.put('/user/transaction/:username', async (req: Request, res: Response) => {
  try {
    const user = await User.updateOne(
      { username: req.params.username },
      { $push: { transactions: req.body } }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error while inserting new transaction for the user' });
  }
})

userRouter.put('/user/income/:username', async (req: Request, res: Response) => {
  let result;
  try {
    await User.updateOne(
      { username: req.params.username },
      {
        $push: { income: { source: req.body.category, amount: req.body.amount } },
        $inc: { availableBalance: req.body.amount, totalIncome: req.body.amount }
      }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error while addding income user' });
  }
})


userRouter.put('/user/incomeamount/:username', async (req: Request, res: Response) => {
  let result;
  try {
    result = await User.updateOne(
      { username: req.params.username, 'income.source': req.body.category },
      {
        $inc: { 'income.$.amount': req.body.amount, availableBalance: req.body.amount, totalIncome: req.body.amount }
      }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error while updating income user' });
  }
})


userRouter.put('/user/transaction/debit/:username', async (req: Request, res: Response) => {
  let result;
  try {
    result = await User.updateOne(
      { username: req.params.username },
      {
        $dec: { availableBalance: req.body.amount }
      }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error while updating user' });
  }
})