import { users } from "../data/users";
import { IUser } from "../interfaces/user";


export class User implements IUser  {

   id:number;
   username: string;
   password: string;

   constructor( username:string, password:string ){
      this.id = users.length+1;
      this.username = username;
      this.password = password;
   }

}