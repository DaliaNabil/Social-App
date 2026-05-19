import mongoose, { Model } from "mongoose";
import { IUser } from "../../Common/Types/interface.types";

const userSchema = new mongoose.Schema <IUser>(
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
      minlength: [2, "First name must be at least 2 characters"],
    },
    email: {
      type: String,
      index: {
        name: "email_unique",
        unique: true,
      },
      required: [true, "Email is required"],
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    }, 
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [120, "Age cannot be greater than 120"],
    },
 
    
  },

);

// Virtuals

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User:Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
