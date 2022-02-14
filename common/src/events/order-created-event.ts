import { Subjects } from "./subjects";
import { OrderStatus } from "../types/order-status";
export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string;
        buyerId: string;
        status: OrderStatus;
        expiresAt: string;
        version: number;
        product: {
            id: string;
            price: number;
        };
    };

}