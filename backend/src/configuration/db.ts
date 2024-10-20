import mongoose from 'mongoose';

export async function dbConnection(): Promise<void|Error> {

    try {

        await mongoose.connect("mongodb://localhost:27017/fingrow");
        console.log("Connected successfully");

    } catch(error: any) {
        throw new Error(`Unable to connect to the database ${error}`);
    }

}