import { User as UserClass} from "../classes/users";
import { register } from "../functions/registration";
import { Server, IncomingMessage, ServerResponse } from "http";
import { User as UserModel} from "../models/users";
import { start } from "../testServer";
import mongoose from "mongoose";
import { IUser } from "../interfaces/user";

describe("Add transactions from CSV file", ()=>{
    let server: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;

    let userDocument:IUser;
    let user:UserClass;
    
    beforeAll(async () => {
        server = await start();
        userDocument = await register("anjani", "anjani123");
        user = new UserClass(userDocument.username, userDocument.password);
        console.log = jest.fn();
        user.transaction = jest.fn();
    });

    afterAll(async () => {
        await UserModel.deleteMany(); 
        await mongoose.connection.close();
        console.log("Connection closed successfully");
        if(server)
           server.close();
    });

    it("Should insert transactions from given CSV file",async ()=>{

        const transactionsPath = "src/data/transactions.csv";


        await user.addTransactionsfromCSVFile(transactionsPath);

        expect(user.transaction).toHaveBeenCalledTimes(19);

        expect(console.log).toHaveBeenCalledWith("Inserted transactions");

    })

    it("Should throw an error if path is empty",async ()=>{
        await expect( user.addTransactionsfromCSVFile("")).rejects.toThrow("Transactions data path is not defined");
        
    })
})