import { Publisher, Subjects, CommentUpdatedEvent } from "@mesocial/common";

export class CommentUpdatedPublisher extends Publisher<CommentUpdatedEvent>{
    readonly subject = Subjects.CommentUpdated;
}