import { Listener, Subjects, FollowCreatedEvent, currentUser } from "@mesocial/common";
import { queueGroupName } from "./queue-group-name";
import { User } from "../../models/user.model";
import { Message } from "node-nats-streaming";

export class FollowCreatedListener extends Listener<FollowCreatedEvent> {
    readonly subject = Subjects.UserFollow;
    queueGroupName = queueGroupName;
    async onMessage(data: FollowCreatedEvent["data"], msg: Message) {

        const currentUser = await User.findOneAndUpdate(
            { _id: data.follower, version: data.currentUserVersion - 1 },
            { $push: { followings: data.following } },
            { new: true }
        );
        if (!currentUser) {
            throw new Error("User Not Found");
        }
        await currentUser.save();

        const user = await User.findOneAndUpdate(
            { _id: data.following, version: data.userVersion - 1 },
            { $push: { followers: data.follower } },
            { new: true }
        );
        if (!user) {
            throw new Error("User Not Found");
        }

        await user.save();

        msg.ack();
    }
}