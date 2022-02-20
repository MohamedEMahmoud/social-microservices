import { Listener, Subjects, UnFollowCreatedEvent } from "@mesocial/common";
import { queueGroupName } from "./queue-group-name";
import { User } from "../../models/user.model";
import { Message } from "node-nats-streaming";

export class UnFollowCreatedListener extends Listener<UnFollowCreatedEvent> {
    readonly subject = Subjects.UserUnFollow;
    queueGroupName = queueGroupName;
    async onMessage(data: UnFollowCreatedEvent["data"], msg: Message) {

        const currentUser = await User.findOneAndUpdate(
            { _id: data.follower, version: data.currentUserVersion - 1 },
            { $pull: { followings: data.following } },
            { new: true }
        );
        if (!currentUser) {
            throw new Error("User Not Found");
        }
        await currentUser.save();

        const user = await User.findOneAndUpdate(
            { _id: data.following, version: data.userVersion - 1 },
            { $pull: { followers: data.follower } },
            { new: true }
        );
        if (!user) {
            throw new Error("User Not Found");
        }

        await user.save();

        msg.ack();
    }
}