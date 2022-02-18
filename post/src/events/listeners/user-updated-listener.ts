import { Listener, Subjects, UserUpdatedEvent } from "@mesocial/common";
import { queueGroupName } from "./queue-group-name";
import { User } from "../../model/user.model";
import { Message } from "node-nats-streaming";

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
    readonly subject = Subjects.UserUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data: UserUpdatedEvent["data"], msg: Message) {

        const user = await User.findByEvent(data);

        if (!user) {
            throw new Error("User Not Found");
        }

        const modifiedField = ["email", "username", "profilePicture", "coverPicture"];
        for (let i in modifiedField) {
            if (user.isModified(`${modifiedField[i]}`)) {
                user.set({
                    email: data.email,
                    username: data.username,
                    profilePicture: data.profilePicture,
                    coverPicture: data.coverPicture
                });
            }
        }

        await user.save();

        msg.ack();
    }
}