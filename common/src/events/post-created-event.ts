import { Subjects } from "./subjects";
import { ModelType } from "../types/model-type";
export interface PostCreatedEvent {
    subject: Subjects.PostCreated;
    data: {
        id: string;
        author: string;
        type: ModelType;
        version: number;
    };
}