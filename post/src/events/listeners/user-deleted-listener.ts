import { Listener, Subjects, UserDeletedEvent } from "@mesocial/common";
import { queueGroupName } from "./queue-group-name";
import { User } from "../../models/user.model";
import { Message } from "node-nats-streaming";

export class UserDeletedListener extends Listener<UserDeletedEvent> {
    readonly subject = Subjects.UserDeleted;
    queueGroupName = queueGroupName;
    async onMessage(data: UserDeletedEvent["data"], msg: Message) {

        const user = await User.findByIdAndDelete(data.id);

        if (!user) {
            throw new Error("User Not Found");
        }

        msg.ack();
    }
}