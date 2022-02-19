import { Subjects } from "./subjects";

export interface ReplyDeletedEvent {
    subject: Subjects.ReplyDeleted;
    data: {
        id: string;
        commentId: string;
    };
}