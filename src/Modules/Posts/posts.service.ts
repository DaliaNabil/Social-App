import { ICreatePost, IPost, IUser } from "../../Common/Types";
import { PostRepository, UserRepository } from "../../DB/Repositories";
import { Types } from "mongoose";
import { BadRequstException } from "../../Common/Utils";
import FileService from "../../Common/Services/file.service";
import fileService from "../../Common/Services/file.service";

class PostService {
  constructor(
    private userRepo: UserRepository = new UserRepository(),
    private fileService = FileService ,
    private postRepo :PostRepository = new PostRepository()
  ) {}

  addPost = async (
    user: IUser,
    body: ICreatePost,
    files: Express.Multer.File[]
  ) => {
    const authorId = user._id;
    const { content, allowComments, location, privacy, tags } = body;

    if (tags && tags.length) {

      const uniqueIds = [...new Set([tags].flat())];
      const validUsers = await this.userRepo.find({ _id: { $in: uniqueIds } });
      
      if (uniqueIds.length !== validUsers.length) {
        throw new BadRequstException("Some tags are invalid");
      }
    }

     console.log({content, files:files.length})
    if (!content && (!files || files.length === 0)) {
      throw new BadRequstException("Content or media is required");
    }

   let media : string[] =[]
   let uploadedFiles
    if (files && files.length > 0) {
       uploadedFiles = await this.fileService.uploadFiles(files , 'Post')
      media = uploadedFiles.map(file =>file.Key)
    }
const newPost = {
    ...body,
    authorId,
    media: media,
    tags: body.tags || []
  };

  
  const createdPost = await this.postRepo.create(newPost);

  
  const postWithUrls = {
    ...(createdPost as Partial<IPost>), 
    media: await Promise.all(
      media.map(async (key) => await this.fileService.renewFileUrl(key))
    )
  };


  return postWithUrls;
};

listHomePagePosts = async () => {
  return await this.postRepo.find({}, {
    populate: { path: 'authorId', select: 'fullName profilePicture firstName lastName' },
    select: ' authorId content location tags media privacy allowComments'
  });
}

// listHomePagePosts = async () => {
//   return await this.postRepo.find({}, {
//     populate: [{ path: 'authorId', select: 'fullName profilePicture' }],
//     select: 'content location tags media'
//   });
// }
}
export default new PostService();