import { Listener, Subjects, FollowCreatedEvent } from "@mesocial/common";
import { queueGroupName } from "./queue-group-name";
import { User } from "../../model/user.model";
import { Message } from "node-nats-streaming";

export class FollowCreatedListener extends Listener<FollowCreatedEvent> {
    readonly subject = Subjects.UserFollow;
    queueGroupName = queueGroupName;
    async onMessage(data: FollowCreatedEvent["data"], msg: Message) {

        const currentUser = await User.findOne({
            id: data.id,
            version: data.currentUserVersion - 1
        });

        const user = await User.findOne({
            id: data.following,
            version: data.userVersion - 1
        });

        if (!user || !currentUser) {
            throw new Error("User Not Found");
        }

        await user.updateOne({ $push: { followers: data.follower } });
        await currentUser.updateOne({ $push: { followings: data.following } });

        msg.ack();
    }
}