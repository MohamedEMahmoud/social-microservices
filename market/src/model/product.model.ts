import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
interface ProductAttrs {
    userId: string;
    images?: { id: string, URL: string; }[];
    desc?: string;
    likes?: string[];
    price: number;
}

interface ProductDoc extends mongoose.Document {
    userId: string;
    images: { id: string, URL: string; }[];
    desc: string;
    likes: string[];
    price: number;
    type: string;
    version: number;
    orderId: string;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        default: []
    },
    desc: {
        type: String,
        min: 1,
        max: 100,
        trim: true,
    },
    likes: {
        type: Array,
        default: []
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        default: "Product"
    },
    orderId: {
        type: String
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

productSchema.set("versionKey", "version");

productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttrs) => new Product(attrs);


const Product = mongoose.model<ProductDoc, ProductModel>("Product", productSchema);

export { Product };