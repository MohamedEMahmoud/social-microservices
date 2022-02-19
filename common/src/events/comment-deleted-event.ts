import { Subjects } from "./subjects";

export interface CommentDeletedEvent {
    subject: Subjects.CommentDeleted;
    data: {
        id: string;
        post?: string;
        product?: string;
    };
}