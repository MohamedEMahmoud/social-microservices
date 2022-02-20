import { Publisher, Subjects, CommentDeletedEvent } from "@mesocial/common";

export class CommentDeletedPublisher extends Publisher<CommentDeletedEvent>{
    readonly subject = Subjects.CommentDeleted;
}