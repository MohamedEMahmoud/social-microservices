import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order.model";
interface ProductAttrs {
    id: string;
    images?: { id: string, URL: string; }[];
    desc?: string;
    price: number;
}

export interface ProductDoc extends mongoose.Document {
    id: string;
    images: { id: string, URL: string; }[];
    desc: string;
    type: string;
    version: number;
    price: number;
    isReserved(): Promise<boolean>;

}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema({
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
    price: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        default: "Product"
    },

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

productSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        product: this,
        status: {
            $in: [
                OrderStatus.created,
                OrderStatus.completed
            ]
        }
    });
    return !!existingOrder;
};

const Product = mongoose.model<ProductDoc, ProductModel>("Product", productSchema);

export { Product };