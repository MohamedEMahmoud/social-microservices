import { Publisher, Subjects, ReplyDeletedEvent } from "@mesocial/common";

export class ReplyDeletedPublisher extends Publisher<ReplyDeletedEvent> {
    readonly subject = Subjects.ReplyDeleted;
}