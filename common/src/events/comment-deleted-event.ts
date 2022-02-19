import { Subjects } from "./subjects";

export interface CommentDeletedEvent {
    subject: Subjects.CommentDeleted;
    data: {
        id: string;
        postId?: string;
        productId?: string;
    };
}