import { Publisher, Subjects, OrderCancelledEvent } from "@mesocial/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}