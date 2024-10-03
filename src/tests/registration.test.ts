import { register } from "../functions/registration";

describe("User Registration Functionality", () => {

    test("should register the user when username and password are provided", () => {
        const user = register("anjani", "anjani123");
        expect(user.username).toBe("anjani");
    });
});