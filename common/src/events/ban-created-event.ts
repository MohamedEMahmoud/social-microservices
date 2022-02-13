import { Subjects } from "./subjects";

export interface BanCreatedEvent {
    subject: Subjects.BanCreated;
    data: {
        id: string;
        ban: {
            id: string;
            end_in: string;
        };
    };
}