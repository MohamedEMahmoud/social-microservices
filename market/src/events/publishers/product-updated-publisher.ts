import { Publisher, Subjects, ProductUpdatedEvent } from "@mesocial/common";

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
    readonly subject = Subjects.ProductUpdated;
}