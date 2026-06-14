import { IUser } from "../../Common/Types/interface.types";
import User from "../Models/user.models";
import BaseRepository from "./base.repository";

 class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  } 
  
  async findUserByEmail(email: string) {
    return  this.findOne({ email } ,"+password" );
  }

  async findUserByPhone(phone: string) {
    return  this.findOne({ phone } );
  }

}

export default UserRepository;