import { Publisher, Subjects, PostDeletedEvent } from "@mesocial/common";

export class PostDeletedPublisher extends Publisher<PostDeletedEvent> {
    readonly subject = Subjects.PostDeleted;
}