import { Subjects } from "./subjects";

export interface CommentCreatedEvent {
    subject: Subjects.CommentCreated;
    data: {
        id: string;
        userId: string;
        postId?: string;
        productId?: string;
        version: number;
    };
}