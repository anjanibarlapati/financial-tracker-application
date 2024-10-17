import { IUser } from "../interfaces/user";
import { User } from "../models/users";

export async function insertUsersData(users: IUser[]) {

        try {
          await User.insertMany(users);
          console.log("Inserted data successfully");
        } catch (error) {
          console.log("Error while inserting data");
        }
      ;
}
