import { Subjects } from "./subjects";

export interface ReplyCreatedEvent {
    subject: Subjects.ReplyCreated;
    data: {
        id: string;
        commentId: string;
    };
}