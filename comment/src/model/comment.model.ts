import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface CommentAttrs {
    userId: string;
    content?: string;
    media?: { id: string, URL: string; }[];
    post?: string;
    product?: string;
    replies?: { userId: string; content: string; media: string; comment: string; }[];
}

interface CommentDoc extends mongoose.Document {
    userId: string;
    content: string;
    media: { id: string, URL: string; }[];
    post: string;
    product: string;
    replies: { userId: string; content: string; media: string; comment: string; }[];
    version: number;
    created_at: string;
    updated_at: string;
}

interface CommentModel extends mongoose.Model<CommentDoc> {
    build(attrs: CommentAttrs): CommentDoc;
}

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    media: {
        type: Array,
        default: []
    },
    content: {
        type: String,
        min: 1,
        max: 100,
        trim: true,
    },
    replies: {
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


commentSchema.set("versionKey", "version");

commentSchema.plugin(updateIfCurrentPlugin);

commentSchema.statics.build = (attrs: CommentAttrs) => new Comment(attrs);


const Comment = mongoose.model<CommentDoc, CommentModel>("Comment", commentSchema);

export { Comment };