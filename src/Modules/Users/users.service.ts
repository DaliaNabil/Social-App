import { Types } from "mongoose";
import fileService from "../../Common/Services/file.service"; 
import { IUser } from "../../Common/Types";
import { User } from "../../DB/Models";
import { UserRepository } from "../../DB/Repositories";
import { NotificationService } from "../../Common/Services";

class UserService {
  private userRepository = new UserRepository();
  private fileService = fileService;
  private notification = NotificationService;

  async uploadProfilePicture(userId: string, file: Express.Multer.File) {
    const key = `Profiles/${Date.now()}-${file.originalname}`;
    await fileService.uploadFile(file, key);
    return await User.findByIdAndUpdate(userId, { profilePicture: key });
  }

  async uploadCoverPicture(userId: string, files: Express.Multer.File[]) {
    const uploadedResults = await fileService.uploadFiles(files, "Covers");
    const keys = uploadedResults.map((res) => res.Key);

    return await User.findByIdAndUpdate(userId, {
      $addToSet: { coverPicture: { $each: keys } },
    });
  }

  async renewExpiredUrl(keys: string[]) {
    return await Promise.all(
      keys.map((key) => fileService.renewFileUrl(key, 3600)),
    );
  }

  async deleteFiles(keys: string[]) {
    return await fileService.deletFiles(keys);
  }

  async deleteUserProfile(user: IUser) {
    const deleteUser = await this.userRepository.findByIdAndDelete(user._id);
    const keysToDelete: string[] = [];

    if (user.profilePicture) {
      keysToDelete.push(user.profilePicture);
    }

    if (user.coverPicture) {
      keysToDelete.push(user.coverPicture);
    }

    if (keysToDelete.length > 0) {
      await fileService.deletFiles(keysToDelete);
    }
    console.log({ keysToDelete });
    return;
  }

  async saveFcmToken(token: string, userId: Types.ObjectId) {
    return await this.userRepository.updateWithFindById(userId, {
      $set: { fcmToken: token },
    });
  }
  async sendNotification(userId: Types.ObjectId, title: string, body: string) {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.fcmToken) return;

    return await this.notification.sendToDevice(user.fcmToken.toString(), { title, body });
  }
}

export default new UserService();