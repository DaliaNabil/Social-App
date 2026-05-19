import { IUser } from "../../Common/Types/interface.types";
import User from "../Models/user.models";
import BaseRepository from "./base.repository";


export default class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  } 
}
