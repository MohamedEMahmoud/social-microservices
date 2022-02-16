import { Publisher, Subjects, FollowCreatedEvent } from "@mesocial/common";

export class FollowCreatedPublisher extends Publisher<FollowCreatedEvent> {
    readonly subject = Subjects.UserFollow;
}