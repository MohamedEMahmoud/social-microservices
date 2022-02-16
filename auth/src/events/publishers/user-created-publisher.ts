import { Publisher, Subjects, UserCreatedEvent } from "@mesocial/common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
    readonly subject = Subjects.UserCreated;
}