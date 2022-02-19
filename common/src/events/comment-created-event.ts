import { Subjects } from "./subjects";

export interface CommentCreatedEvent {
    subject: Subjects.CommentCreated;
    data: {
        id: string;
        userId: string;
        post?: string;
        product?: string;
        version: number;
    };
}