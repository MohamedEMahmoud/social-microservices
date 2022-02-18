import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@mesocial/common";

interface OrderAttrs {
    id: string;
    buyerId: string;
    status: OrderStatus;
    price: number;
    version: number;
}

interface OrderDoc extends mongoose.Document {
    id: string;
    buyerId: string;
    price: number;
    status: OrderStatus;
    version: number;
    created_at: string;
    updated_at: string;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
    findByEvent(event: { id: string; version: number; }): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema({
    buyerId: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.created
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

orderSchema.set("versionKey", "version");

orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => new Order({ _id: attrs.id, ...attrs });

orderSchema.statics.findByEvent = (event: { id: string; version: number; }) => {
    return Order.findOne({
        _id: event.id,
        version: event.version - 1
    });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order, OrderStatus };