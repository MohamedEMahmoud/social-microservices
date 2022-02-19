import { Subjects } from "./subjects";

export interface PostUpdatedEvent {
    subject: Subjects.PostUpdated;
    data: {
        id: string;
        commentId?: string;
        version: number;
    };
}