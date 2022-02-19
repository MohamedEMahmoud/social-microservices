import { Subjects } from "./subjects";

export interface ReplyCreated {
    subject: Subjects.ReplyCreated;
    data: {
        id: string;
        comment: string;
    };
}