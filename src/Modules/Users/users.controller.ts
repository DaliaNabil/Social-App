import { Request, Response, Router } from "express";
import usersService from "./users.service"; 
import upload from "../../Middlewares/Multer.middleware";
import { authMiddleware, responseFormatter } from "../../Middlewares";
import { IAuth } from "../../Common/Types";

const usersController = Router(); 

usersController.post("/upload-profile", authMiddleware, upload.single("profile"), async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const userId = (req as IAuth).user?._id; 
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await usersService.uploadProfilePicture(userId.toString(), req.file);
    return res.status(200).json({ data: result });
});

usersController.post("/upload-cover", authMiddleware, upload.array("covers"), async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) return res.status(400).json({ message: "No files uploaded" });
    const userId = (req as IAuth).user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await usersService.uploadCoverPicture(userId.toString(), files);
    return res.status(200).json(result);
});

usersController.delete('/delete-profile', authMiddleware, responseFormatter(
  async (req: Request, res: Response) => {
    const user = (req as IAuth).user;
    await usersService.deleteUserProfile(user);
    return { message: 'Profile deleted successfully', meta: { statusCode: 200 } };
  }
));

usersController.post('/save-token', authMiddleware, responseFormatter(
  async (req: Request, res: Response) => {
    const { fcmToken } = req.body;
    const userId = (req as IAuth).user?._id;
    
    await usersService.saveFcmToken(fcmToken, userId);
    return { message: 'SaveToken fcm successfully', meta: { statusCode: 200 } };
  }
));

usersController.post('/send-notification', authMiddleware, responseFormatter(
  async (req: Request, res: Response) => {
    const { title, body } = req.body;
    const userId = (req as IAuth).user?._id;
    
    await usersService.sendNotification(userId, title, body);
    return { message: 'Notification send successfully', meta: { statusCode: 200 } };
  }
));

export default usersController;