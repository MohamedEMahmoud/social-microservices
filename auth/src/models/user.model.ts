import mongoose from "mongoose";
import { GenderType } from "@mesocial/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Password } from "../services/Password";

interface UserAttrs {
    username: string;
    email: string;
    password: string;
    gender: GenderType;
    profilePicture?: string;
    coverPicture?: string;
    description?: string;
    city?: string;
    from?: string;
    isAdmin?: boolean;
    macAddress: { MAC: string; }[];
}

interface UserDoc extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    gender: GenderType;
    profilePicture: string;
    coverPicture: string;
    followers: [];
    followings: [];
    description: string;
    city: string;
    from: string;
    isAdmin: boolean;
    macAddress: { MAC: String; }[];
    ban: { period: string; reason: string; end_in: Date; }[];
    hasAccess: boolean;
    version: number;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        min: 3,
        max: 20,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password Must Be More Than 8 Character"]
    },
    gender: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        enum: Object.values(GenderType),
        default: ""
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
    description: {
        type: String,
        max: 50
    },
    city: {
        type: String,
        max: 50
    },
    from: {
        type: String,
        max: 50
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    macAddress: {
        type: Array
    },
    ban: [{
        period: {
            type: String,
            trim: true
        },
        reason: {
            type: String,
            trim: true
        },
        end_in: {
            type: Date,
        }
    }],
    hasAccess: {
        type: Boolean,
        default: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
        }
    },
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

userSchema.set("versionKey", "version");

userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.build = (attrs) => new User(attrs);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"));
        this.set("password", hashed);
    }
    next();
});



const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User, GenderType };