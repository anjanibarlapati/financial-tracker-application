import express, {Request, Response} from 'express';
import { User } from '../models/users';

export const userRouter = express.Router();

userRouter.post('/user', async (req:Request, res:Response) => {
    try {
      console.log(req.body);  
     const user=  await User.create(req.body);
     res.json(user);
    } catch (error) {
       console.log(error);
      res.status(500).json({ message: 'Error while inserting user' });
    }
});

userRouter.get('/users', async(req:Request, res:Response)=>{
    try {
        const users=  await User.find();
        res.json(users);
       } catch (error) {
         res.status(500).json({ message: 'Error while getting all users' });
       }
})

userRouter.get('/user', async(req:Request, res:Response)=>{
  try{
    const user = await User.findOne({username:req.params.username, password: req.params.password});
    res.json(user);
  } catch(error){
    res.status(500).json({ message: 'Error while getting user' });
  }
});

