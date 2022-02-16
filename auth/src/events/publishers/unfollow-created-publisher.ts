import { Publisher, Subjects, UnFollowCreatedEvent } from "@mesocial/common";

export class UnFollowCreatedPublisher extends Publisher<UnFollowCreatedEvent> {
    readonly subject = Subjects.UserUnFollow;
}