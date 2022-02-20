import mongoose from "mongoose";

interface ReplyAttrs {
    userId: string;
    content?: string;
    media?: { id: string, URL: string; }[];
    comment: string;
}

export interface ReplyDoc extends mongoose.Document {
    userId: string;
    content: string;
    media: { id: string, URL: string; }[];
    comment: string;
    created_at: string;
    updated_at: string;
}

interface ReplyModel extends mongoose.Model<ReplyDoc> {
    build(attrs: ReplyAttrs): ReplyDoc;
}

const replySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
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
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false
});

replySchema.statics.build = (attrs: ReplyAttrs) => new Reply(attrs);

const Reply = mongoose.model<ReplyDoc, ReplyModel>("Reply", replySchema);

export { Reply };