import { IPost, IUser } from "../../Common/Types/interface.types";
import { Post } from "../Models";
import BaseRepository from "./base.repository";

 class PostRepository extends BaseRepository<IPost> {
  constructor() {
    super(Post);
  } 
  
  
}

export default PostRepository;