import { Subjects } from "./subjects";

export interface FollowCreatedEvent {
    subject: Subjects.UserFollow;
    data: {
        id: string;
        follower?: string;
        following?: string;
        version: number;
    };
}