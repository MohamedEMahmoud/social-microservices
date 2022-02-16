import { Publisher, Subjects, OrderCreatedEvent } from "@mesocial/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}