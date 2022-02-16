import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ModelType } from "@mesocial/common";
interface ProductAttrs {
    id: string;
    merchantId: string;
    type: ModelType;
    comments: string[];
}

interface ProductDoc extends mongoose.Document {
    id: string;
    merchantId: string;
    type: ModelType;
    comments: string[];
    version: number;
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

productSchema.set("versionKey", "version");

productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttrs) => new Product({ _id: attrs.id, ...attrs });


const Product = mongoose.model<ProductDoc, ProductModel>("Product", productSchema);

export { Product };