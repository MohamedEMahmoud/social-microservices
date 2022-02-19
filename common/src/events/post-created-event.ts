import { Subjects } from "./subjects";
export interface PostCreatedEvent {
    subject: Subjects.PostCreated;
    data: {
        id: string;
        author: string;
        version: number;
    };
}