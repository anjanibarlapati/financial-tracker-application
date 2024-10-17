import { insertUsersData } from '../insertions/insertions';
import { User } from '../models/users';
import { users } from "../data/users";

jest.mock('../models/users');
jest.mock('../data/users', () => ({
  users: []
}));

describe("Insertion", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        console.log = jest.fn(); 

    });

    it('should insert users data successfully', async () => {

      (User.insertMany as jest.Mock).mockImplementation(async (users) => {
            return Promise.resolve(users);
        });

        await insertUsersData(users);

        expect(User.insertMany).toHaveBeenCalledWith(users);
        expect(console.log).toHaveBeenCalledWith("Inserted data successfully");
    });

    it('should throw error if inserting data fails', async () => {
        (User.insertMany as jest.Mock).mockImplementation(async (users) => {
            throw new Error("Insertion failed");
        });

        await insertUsersData(users);

        expect(User.insertMany).toHaveBeenCalledWith(users);
        expect(console.log).toHaveBeenCalledWith("Error while inserting data");
    });
});
