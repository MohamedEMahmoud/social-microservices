import { Subjects } from "./subjects";

export interface UnFollowCreatedEvent {
    subject: Subjects.UserUnFollow;
    data: {
        id: string;
        follower: string;
        following: string;
        version: number;
        currentUserVersion: number;
        userVersion: number;
    };
}