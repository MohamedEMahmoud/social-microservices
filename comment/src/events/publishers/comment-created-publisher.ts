import { Publisher, Subjects, CommentCreatedEvent } from "@mesocial/common";

export class CommentCreatedPublisher extends Publisher<CommentCreatedEvent>{
    readonly subject = Subjects.CommentCreated;
}