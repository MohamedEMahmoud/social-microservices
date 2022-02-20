import { Publisher, Subjects, ReplyCreatedEvent } from "@mesocial/common";

export class ReplyCreatedPublisher extends Publisher<ReplyCreatedEvent> {
    readonly subject = Subjects.ReplyCreated;
}