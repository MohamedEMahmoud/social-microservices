import { Subjects } from "./subjects";

export interface ProductUpdatedEvent {
    subject: Subjects.ProductUpdated;
    data: {
        id: string;
        userId: string;
        images: { id: string, URL: string; }[],
        content: string;
        price: number;
        version: number;
        orderId?: string;
    };
}