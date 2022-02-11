import { Subjects } from "./subjects";

export interface ProductUpdatedEvent {
    subject: Subjects.ProductUpdated;
    data: {
        id: string;
        userId: string;
        images: { id: string, URL: string; }[],
        desc: string;
        price: number;
        version: number;
    };
}