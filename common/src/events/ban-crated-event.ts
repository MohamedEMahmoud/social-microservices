import { Subjects } from "./subjects";

export interface BanCreatedEvent {
    subject: Subjects.BanCreated;
    data: {
        id: string;
        version: number;
        ban: {
            id: string;
            end_in: string;
        };
    };
}