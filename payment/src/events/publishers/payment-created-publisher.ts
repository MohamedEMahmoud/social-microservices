import { Publisher, PaymentCreatedEvent, Subjects } from "@mesocial/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
}