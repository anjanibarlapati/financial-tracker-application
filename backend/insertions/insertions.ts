import { users } from "../data/users";
import { User } from "../models/users";

export async function insertUsersData() {

        try {
          await User.insertMany(users);
          console.log("Inserted data successfully");
        } catch (error) {
          console.log("Error while inserting data");
        }
      ;
}
