import mongoose, { Model } from "mongoose";
import { IPost, IUser } from "../../Common/Types/interface.types";
import { CHANNELS, GENDER, PROVIDERS, STATUS, USER_ROLES } from "../../Common/Types";
import { SecurityService } from "../../Common/Services";
import { log } from "node:console";
import { PostRepository } from "../Repositories";
import { Post } from ".";
import fileService from "../../Common/Services/file.service";


const securityService = new SecurityService()
const postRepository = new PostRepository()
const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"], 
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [120, "Age cannot be greater than 120"],
    },
    email: {
      type: String,
      index: {
        name: "email_unique",
        unique: true,
      },
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },
    gender: {
      type: String ,
      enum: Object.values(GENDER),
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    phone: {
      type: String,
      index: {
        name: "phone_unique",
        unique: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },
    googleSub: {
      type: String,
      index: {
        name: "idx_googleSub_unique",
        unique: true,
      },
    },
    provider: {
      type: String,
      enum: Object.values(PROVIDERS),
      default: PROVIDERS.SYSTEM,
    },
    profilePicture: { type: String },
    coverPicture: [String] ,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    OTPs: [
      {
        value: {
          type: String,
          required: true,
        },
        expireAt: {
          type: Date,
          default: () => new Date(Date.now() + 5 * 60 * 1000), 
        },
        channel: {
          type: String,
          enum: Object.values(CHANNELS),
        },
      },
    ],
    workExperience: [
      {
        company: {
          type: String,
          required: true,
          trim: true,
        },
        position: {
          type: String,
          required: true,
          trim: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          default: null, 
        },
        description: {
          type: String,
          trim: true, 
        },
        currentlyWorking: {
          type: Boolean,
          default: false,
        },
         fcmToken:String 
      },
    ],
   
  },
 {
    toJSON: { getters: true, virtuals: true }, 
    toObject: { getters: true, virtuals: true },
    timestamps: true,
  }
);

// Virtuals
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Middleware 
userSchema.pre("save", async function () {
  const isPasswordModified = this.isModified('password');
  const isPhoneNumberModified  = this.isModified('phone')
  console.log('Is password Modified', isPasswordModified);
  console.log('Is phone number modified', isPhoneNumberModified)

  if (isPasswordModified && this.password && typeof this.password === 'string') {
    this.password = await securityService.hashPassword(this.password)
  }
  if(isPhoneNumberModified  && this.phone && typeof this.phone === 'string'){
    this.phone = await securityService.encrypt(this.phone)
  }
  console.log('user after pre save ', this)

});


// Query Middleware
userSchema.post(['findOne', 'find'], async function(result) {
  if (!result) return;

  const userList = Array.isArray(result) ? result : [result];

  for (const user of userList) {
    if (user && user.phone) {
      try {
        user.phone = await securityService.decrypt(user.phone);
      } catch (error) {
        console.error(`Failed to decrypt phone for user ${user._id}:`, error);
        user.phone = "Invalid Data"; 
      }
    }
  }
});

//post hook on delete method to delet related posts for this user
userSchema.post('findOneAndDelete', async function(doc) {
  if (doc && doc._id) {
    try {
     
      const userPosts = await postRepository.find({ authorId: doc._id });

      if (userPosts && userPosts.length > 0) {
       
        const allKeysToDelete = userPosts
          .flatMap((post: IPost) => post.media)
          .filter((key: string) => typeof key === 'string' && key.length > 0);

        
        if (allKeysToDelete.length > 0) {
          await fileService.deletFiles(allKeysToDelete);
          console.log(`Successfully deleted ${allKeysToDelete.length} files from S3 for user: ${doc._id}`);
        }
      }

    
      const result = await postRepository.deleteMany({ authorId: doc._id });
      console.log(`Deleted all posts for user: ${doc._id}`, result);

    } catch (error) {
      console.error("Error occurred while cleaning up user data:", error);
    }
  }
});




const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;