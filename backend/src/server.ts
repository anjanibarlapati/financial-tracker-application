import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {dbConnection} from './configuration/db';
import { insertUsersData } from './insertions/insertions';
import { userRouter } from './routes/users';
import { users } from './data/dbUsers';


const app = express();
const port = 4321;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

async function start() {
   try{
      app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
      });
      await dbConnection();
      await insertUsersData(users);
   } 
   catch(error) {
    throw new Error("Error while connectiong to DB or inserting");
   }
}

start();


app.use('/',userRouter);

