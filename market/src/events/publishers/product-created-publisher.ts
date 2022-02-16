import { Publisher, Subjects, ProductCreatedEvent } from "@mesocial/common";

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
    readonly subject = Subjects.ProductCreated;
}