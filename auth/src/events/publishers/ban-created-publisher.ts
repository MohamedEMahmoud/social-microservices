import { Publisher, Subjects, BanCreatedEvent } from "@mesocial/common";

export class BanCreatedPublisher extends Publisher<BanCreatedEvent> {
    readonly subject = Subjects.BanCreated;
}