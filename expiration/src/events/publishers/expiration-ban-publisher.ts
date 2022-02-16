import { Publisher, Subjects, ExpirationBanEvent } from "@mesocial/common";

export class ExpirationBanPublisher extends Publisher<ExpirationBanEvent> {
    readonly subject = Subjects.ExpirationBan;
}