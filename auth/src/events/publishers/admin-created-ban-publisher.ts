import { Publisher, Subjects, AdminCreatedBanEvent } from "@mesocial/common";

export class AdminCreatedBanPublisher extends Publisher<AdminCreatedBanEvent> {
    readonly subject = Subjects.AdminCreatedBan;
}