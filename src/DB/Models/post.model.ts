import mongoose, { Schema, Model } from "mongoose";
import { IPost, POST_PRIVACY } from "../../Common/Types";

const postSchema = new Schema<IPost>({
    content: { type: String, required: true },
    authorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    privacy: { 
        type: String, 
        enum: Object.values(POST_PRIVACY), 
        default: POST_PRIVACY.PUBLIC 
    },
    media: [String],
    allowComments: { type: Boolean, default: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    location: { type: String }
}, { timestamps: true });

const postModel: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default postModel;