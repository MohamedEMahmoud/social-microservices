import { Subjects } from "./subjects";

export interface ReplyDeleted {
    subject: Subjects.ReplyDeleted;
    data: {
        id: string;
        comment: string;
    };
}