import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ModelType } from "@mesocial/common";
interface ProductAttrs {
    merchantId: string;
    images?: { id: string, URL: string; }[];
    content?: string;
    likes?: string[];
    price: number;
}

interface ProductDoc extends mongoose.Document {
    merchantId: string;
    images: { id: string, URL: string; }[];
    content: string;
    likes: string[];
    price: number;
    type: string;
    version: number;
    comments: string[];
    orderId: string;
    created_at: string;
    updated_at: string;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema({
    merchantId: {
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
    price: {
        type: Number,
        required: true,
        min: 5
    },
    type: {
        type: String,
        default: ModelType.Product
    },
    orderId: {
        type: String
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

productSchema.set("versionKey", "version");

productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttrs) => new Product(attrs);


const Product = mongoose.model<ProductDoc, ProductModel>("Product", productSchema);

export { Product };