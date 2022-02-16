import { Publisher, Subjects, UserUpdatedEvent } from "@mesocial/common";

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
    readonly subject = Subjects.UserUpdated;
}