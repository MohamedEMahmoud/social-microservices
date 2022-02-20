import { Listener, Subjects, UserUpdatedEvent } from "@mesocial/common";
import { queueGroupName } from "./queue-group-name";
import { User } from "../../models/user.model";
import { Message } from "node-nats-streaming";
import _ from "lodash";
export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
    readonly subject = Subjects.UserUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data: UserUpdatedEvent["data"], msg: Message) {

        const user = await User.findByEvent(data);

        if (!user) {
            throw new Error("User Not Found");
        }

        let fields: { [key: string]: any; } = { ...data };

        delete fields["version"];

        user.set({ ...fields });

        await user.save();

        msg.ack();
    }
}