import mongoose from "mongoose";
import { ModelType } from "@mesocial/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface PostAttrs {
    author: string;
    images?: { id: string, URL: string; }[];
    content?: string;
    likes?: string[];
}

interface PostDoc extends mongoose.Document {
    author: string;
    images: { id: string, URL: string; }[];
    content: string;
    likes: string[];
    type: string;
    version: number;
    created_at: string;
    updated_at: string;
}

interface PostModel extends mongoose.Model<PostDoc> {
    build(attrs: PostAttrs): PostDoc;
}

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    images: {
        type: Array,
        default: []
    },
    content: {
        type: String,
        min: 1,
        max: 100,
        trim: true,
    },
    likes: {
        type: Array,
        default: []
    },
    type: {
        type: String,
        default: ModelType.Post
    },
    comments: {
        type: Array,
        default: []
    }

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
});

postSchema.set("versionKey", "version");

postSchema.plugin(updateIfCurrentPlugin);

postSchema.statics.build = (attrs: PostAttrs) => new Post(attrs);

const Post = mongoose.model<PostDoc, PostModel>("Post", postSchema);

export { Post };