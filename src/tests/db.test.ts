import { dbConnection } from "../../backend/configuration/db"
import mongoose from 'mongoose';

jest.mock('mongoose');

describe("Database connection", ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
        console.log = jest.fn();
    });

    test("Should connect to the database successfully", async ()=>{
        (mongoose.connect as jest.Mock).mockResolvedValue("");

        await dbConnection();
        
        expect(mongoose.connect).toHaveBeenCalledWith("mongodb://localhost:27017/fingrow");
        expect(console.log).toHaveBeenCalledWith("Connected successfully");


    })

    test("Should throw an error if database connection fails", async ()=>{
        const mockError = new Error('Connection failed');
        (mongoose.connect as jest.Mock).mockRejectedValue(mockError);

        await dbConnection();

        expect(mongoose.connect).toHaveBeenCalledWith("mongodb://localhost:27017/fingrow");
        expect(console.log).toHaveBeenCalledWith("Unable to connect to the databse", mockError);
    })
})