import { Publisher, Subjects, PostUpdatedEvent } from "@mesocial/common";

export class PostUpdatedPublisher extends Publisher<PostUpdatedEvent> {
    readonly subject = Subjects.PostUpdated;
}