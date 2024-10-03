import { register } from "../functions/registration";

describe("User Registration Functionality", () => {

    test("should register the user when username and password are provided", () => {
        const user = register("anjani", "anjani123");
        expect(user.username).toBe("anjani");
    });

    test("should throw an error when username is empty", ()=>{
        expect(()=>register("","anjani123")).toThrow('Username and password should be non-empty');
    });

    test("should throw an error if password is empty", ()=>{
        expect(()=>register("anjaniii","")).toThrow('Username and password should be non-empty');
    });

    test("should throw an error if both username and passowrd is empty", ()=>{
        expect(()=>register("","")).toThrow('Username and password should be non-empty');
    });

    test("should throw an error if username is already exist", () => {
        register("seetha", "seetha123");
        expect(() => register("seetha", "12345")).toThrow('Username is already exist');
    });

});