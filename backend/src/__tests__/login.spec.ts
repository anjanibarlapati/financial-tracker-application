import { login } from "../functions/login";
import { register } from "../functions/registration";
import { Server, IncomingMessage, ServerResponse } from "http";
import { User } from "../models/users";
import { start } from "../testServer";
import mongoose from "mongoose";
import { IUser } from "../interfaces/user";


describe("User Authentication Functionality",()=>{

    let server: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;
    beforeAll(async () => {
        server = await start();
    });
    
    afterAll(async () => {
        await User.deleteMany(); 
        await mongoose.connection.close();
        console.log("Connection closed successfully");
        if(server)
           server.close();
    });

    test("should log in the user with correct credentials", async ()=>{

        const newUser:IUser = await register("anjani", "anjani123");
        expect(await login("anjani", "anjani123")).toBeTruthy()
    });

    test("should throw an error if username is inavlid", async  ()=>{
        await expect(login("anjaniii", "anjani123")).rejects.toThrow('Username and password should be valid');
    });

    test("shouldthrow an error if password is incorrect", async ()=>{   
        await expect(login("anjani", "12345")).rejects.toThrow('Username and password should be valid');
    });

    test("should throw an error if username or password is not given", async ()=>{
        await expect(login("12345")).rejects.toThrow('Provide both username and password');
    });

    test("should throw an error if both username and password is not given", async ()=>{
        await expect(login()).rejects.toThrow('Provide both username and password');
    });

    test("should throw an error if username is empty", async ()=>{
        await expect( login("","anjani123")).rejects.toThrow('Username and password should be non-empty');
    })

    test("should throw an error if password is empty", async ()=>{
        await expect(login("anjani","")).rejects.toThrow('Username and password should be non-empty');
    });

    test("should throw an error if both username and passowrd is empty", async ()=>{
        await expect(login("","")).rejects.toThrow(new Error('Username and password should be non-empty'));
    })

})