import { login } from "../functions/login";
import { register } from "../functions/registration";

describe("User Authentication Functionality",()=>{

    test("should log in the user with correct credentials", ()=>{

        register("anjani", "anjani123");
        expect(login("anjani", "anjani123")).toBeTruthy()
    });

    test("should throw an error if username is inavlid", ()=>{
        expect(()=>login("anjaniii", "anjani123")).toThrow('Username and password should be valid');
    });

    test("shouldthrow an error if password is incorrect", ()=>{   
        expect(()=>login("anjani", "12345")).toThrow('Username and password should be valid');
    });

    test("should throw an error if username or password is not given", ()=>{
        expect(()=>login("12345")).toThrow('Provide both username and password');
    })

})