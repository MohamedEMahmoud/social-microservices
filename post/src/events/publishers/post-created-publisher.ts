import { Publisher, Subjects, PostCreatedEvent } from "@mesocial/common";

export class PostCreatedPublisher extends Publisher<PostCreatedEvent> {
    readonly subject = Subjects.PostCreated;
}