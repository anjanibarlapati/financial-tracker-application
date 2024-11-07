import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { userRouter } from './routes/users';
import { testDbConnection } from './configuration/testDb';


const app = express();
const port = 4321;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

export async function start() {
   try{
    await testDbConnection();
    
    app.use('/',userRouter);

     let server = app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
    return server;
   } 
   catch(error) {
     throw new Error("Error while connectiong to DB or inserting");
   }
}


