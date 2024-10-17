import mongoose from 'mongoose';

export async function testDbConnection(): Promise<void> {

    try {

        await mongoose.connect("mongodb://localhost:27017/test_db");
        console.log("Connected successfully");

    } catch(Error: any) {
        console.log("Unable to connect to the databse", Error);
    }

}