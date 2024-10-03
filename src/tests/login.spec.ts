import { login } from "../functions/login";
import { register } from "../functions/registration";

describe("User Authentication Functionality",()=>{

    test("should log in the user with correct credentials", ()=>{

        register("anjani", "anjani123");
        expect(login("anjani", "anjani123")).toBeTruthy()
    })
})