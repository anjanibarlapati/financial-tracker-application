import mongoose from "mongoose";
import { register } from "../functions/registration";
import { User } from "../../backend/models/users";
import { start } from "../../backend/testIndex";
import { Server, IncomingMessage, ServerResponse } from "http";
import { IUser } from "../interfaces/user";

describe("User Registration Functionality", () => {
    let server: Server<typeof IncomingMessage, typeof ServerResponse> | undefined;
    beforeAll(async () => {
        server = await start();
    });

    afterEach(async () => {
        await User.deleteMany(); 
    });

    afterAll(async () => {
        await mongoose.connection.close();
        console.log("Connection closed successfully");
        if(server)
           server.close();
    });


    test("should register the user when username and password are provided", async () => {
        const user:IUser = await register("anjani", "anjani123");
        expect(user.username).toBe("anjani");
    });

    test("should throw an error when username is empty", async ()=>{
         await expect(register("","anjani123")).rejects.toThrow('Username and password should be non-empty');
    });

    test("should throw an error if password is empty", async ()=>{
        await expect(register("anjaniii","")).rejects.toThrow('Username and password should be non-empty');
    });

    test("should throw an error if both username and passowrd is empty", async ()=>{
        await expect(register("","")).rejects.toThrow('Username and password should be non-empty');
    });

    test("should throw an error if username is already exist", async () => {
        await register("seetha", "seetha123");
        await expect(register("seetha", "12345")).rejects.toThrow('Username is already exist');
    });

    test("should throw an error if username or password is not given", async()=>{
        await expect(register("password123")).rejects.toThrow('Provide both username and password');
    });

    test("should throw an error if both username and password is not given", async ()=>{
       await expect(register()).rejects.toThrow('Provide both username and password');
    });

});