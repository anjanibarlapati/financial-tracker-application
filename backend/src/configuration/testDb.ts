import mongoose from 'mongoose';

export async function testDbConnection(): Promise<void> {

    try {

        await mongoose.connect("mongodb://localhost:27017/test_db");
        console.log("Connected successfully");

    } catch(error: any) {
        throw new Error(`Unable to connect to the database ${error}`);
    }

}