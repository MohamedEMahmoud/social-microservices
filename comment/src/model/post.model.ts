import mongoose from "mongoose";
import { ModelType } from "@mesocial/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface PostAttrs {
    id: string;
    author: string;
    type: ModelType;
    comments: string[];
}

interface PostDoc extends mongoose.Document {
    id: string;
    author: string;
    type: ModelType;
    comments: string[];
    version: number;
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
    type: {
        type: String,
        required: true,
        enum: Object.values(ModelType),
    },
    comments:
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
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

postSchema.statics.build = (attrs: PostAttrs) => new Post({ _id: attrs.id, ...attrs });

const Post = mongoose.model<PostDoc, PostModel>("Post", postSchema);

export { Post };