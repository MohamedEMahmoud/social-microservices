import { Listener, Subjects, AdminCreatedBanEvent } from "@mesocial/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-ban-queue";
export class AdminCreatedBanListener extends Listener<AdminCreatedBanEvent> {
    readonly subject = Subjects.AdminCreatedBan;
    queueGroupName = queueGroupName;
    async onMessage(data: AdminCreatedBanEvent["data"], msg: Message) {

        const delay = new Date(String(data.ban.end_in)).getTime() - new Date().getTime();

        expirationQueue.add(
            {
                userId: data.id,
                banId: data.ban.id
            },
            {
                delay
            }
        );

        msg.ack();
    }
}
