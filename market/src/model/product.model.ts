import mongoose from "mongoose";

interface ProductAttrs {
    userId: string;
    images?: { id: string, URL: string; }[];
    desc?: string;
    likes?: string[];
}

interface ProductDoc extends mongoose.Document {
    userId: string;
    images: { id: string, URL: string; }[];
    desc: string;
    likes: string[];
    type: string;
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
    type: {
        type: String,
        default: "Product"
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

productSchema.statics.build = (attrs: ProductAttrs) => new Product(attrs);


const Product = mongoose.model<ProductDoc, ProductModel>("Product", productSchema);

export { Product };