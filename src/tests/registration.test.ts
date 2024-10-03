import { register } from "../functions/registration";

describe("User Registration Functionality", () => {

    test("should register the user when username and password are provided", () => {
        const user = register("anjani", "anjani123");
        expect(user.username).toBe("anjani");
    });

    test("should throw an error when username is empty", ()=>{
        expect(()=>register("","anjani123")).toThrow('Username and password should be non-empty');
    })

});