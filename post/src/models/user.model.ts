import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface UserAttrs {
    id: string;
    username: string;
    email: string;
    profilePicture: string;
    coverPicture: string;
}

interface UserDoc extends mongoose.Document {
    username: string;
    email: string;
    profilePicture: string;
    coverPicture: string;
    followers: [];
    followings: [];
    version: number;
    created_at: string;
    updated_at: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
    findByEvent(event: { id: string; version: number; }): Promise<UserDoc | null>;
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    coverPicture: {
        type: String,
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    },
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

userSchema.set("versionKey", "version");

userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.findByEvent = (event: { id: string; version: number; }) => {
    return User.findOne({
        id: event.id,
        version: event.version - 1
    });
};
userSchema.statics.build = (attrs) => new User({ _id: attrs.id, ...attrs });

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };