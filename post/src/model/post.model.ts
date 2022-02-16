import mongoose from "mongoose";

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
    created_at: string;
    updated_at: string;
}

interface PostModel extends mongoose.Model<PostDoc> {
    build(attrs: PostAttrs): PostDoc;
}

const postSchema = new mongoose.Schema({
    author: {
        type: String,
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
        default: "Post"
    }

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
});

postSchema.statics.build = (attrs: PostAttrs) => new Post(attrs);


const Post = mongoose.model<PostDoc, PostModel>("Post", postSchema);

export { Post };