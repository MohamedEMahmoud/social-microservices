import mongoose from "mongoose";
import { GenderType, RolesType, CoverPicture } from "@mesocial/common";
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
    roles?: RolesType;
    macAddress: { MAC: string; }[];
    activeKey: string;
    active?: boolean;
    resetPasswordKey?: string;
    resetPasswordExpires?: string;
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
    roles: RolesType;
    macAddress: { MAC: String; }[];
    ban: { id: string; period: string; reason: string; end_in: string; }[];
    hasAccess: boolean;
    version: number;
    activeKey: string;
    active: boolean;
    resetPasswordKey: string;
    resetPasswordExpires: string;
    created_at: string;
    updated_at: string;
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
        minlength: [8, 'Username must be more than 8 characters'],
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
    },
    profilePicture: {
        type: String,
    },
    coverPicture: {
        type: String,
        default: CoverPicture.Default
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
    roles: {
        type: String,
        required: true,
        enum: Object.values(RolesType),
        default: RolesType.User
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
            type: String,
        }
    }],
    hasAccess: {
        type: Boolean,
        default: true
    },
    activeKey: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false
    },
    resetPasswordKey: {
        type: String,
    },
    resetPasswordExpires: {
        type: String,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            ret.ban = ret.ban.map((data: any) => {
                const { period, reason, end_in, _id: id } = data;
                return { period, reason, end_in, id };
            });
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