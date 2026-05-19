import { UserRepository } from "../../DB/Repositories";


class AuthService {
    constructor( private  userRepository:UserRepository = new UserRepository()) { }
    health=( body:object)=>{
      return  this.userRepository.find({})
        
    }
}
export default new AuthService();