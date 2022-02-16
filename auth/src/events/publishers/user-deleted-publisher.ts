import { Publisher, Subjects, UserDeletedEvent } from "@mesocial/common";

export class UserDeletedPublisher extends Publisher<UserDeletedEvent> {
    readonly subject = Subjects.UserDeleted;
}