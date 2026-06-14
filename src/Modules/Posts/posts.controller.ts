
import {Request, Response, Router} from "express"
import { authMiddleware, responseFormatter, upload } from "../../Middlewares";
import { IAuth } from "../../Common/Types";
import { meta } from "zod/v4/core";
import postsService from "./posts.service";

const postsController = Router();

postsController.post('/add' , authMiddleware , upload.array('media',4) ,responseFormatter(
async (req :Request , res:Response)=>{
  
    const user =(req as IAuth).user
    const body = req.body
  const files = req.files as Express.Multer.File[]
    const result = await postsService.addPost(user,body ,files)
    return {message:'Post created successfully', data:result , meta : {statusCode:201}}
}))

postsController.get('/home' , authMiddleware , responseFormatter(
  async(req:Request, res:Response)=>{
    const result = await postsService.listHomePagePosts()

    return {message:'Home page posts retrieved successfully', data : result , meta:{statusCode:200}
  }}
))
export default postsController;