import mongoose from 'mongoose';
import { testDbConnection } from '../configuration/testDb';

jest.mock('mongoose');

describe("Database connection", ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
        console.log = jest.fn();
    });

    test("Should connect to the database successfully", async ()=>{
        (mongoose.connect as jest.Mock).mockResolvedValue("");

        await testDbConnection();
        
        expect(mongoose.connect).toHaveBeenCalledWith("mongodb://localhost:27017/test_db");
        expect(console.log).toHaveBeenCalledWith("Connected successfully");


    })

    test("Should throw an error if database connection fails", async ()=>{
        (mongoose.connect as jest.Mock).mockRejectedValue(new Error('Unable to connect to the database'));
        await expect(testDbConnection()).rejects.toThrow("Unable to connect to the database");
    })
})