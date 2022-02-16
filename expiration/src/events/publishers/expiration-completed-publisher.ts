import { Publisher, ExpirationCompletedEvent, Subjects } from "@mesocial/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent>{
    readonly subject = Subjects.ExpirationCompleted;
}