import { Listener, Subjects, UnFollowCreatedEvent } from "@mesocial/common";
import { queueGroupName } from "./queue-group-name";
import { User } from "../../model/user.model";
import { Message } from "node-nats-streaming";

export class UnFollowCreatedListener extends Listener<UnFollowCreatedEvent> {
    readonly subject = Subjects.UserUnFollow;
    queueGroupName = queueGroupName;
    async onMessage(data: UnFollowCreatedEvent["data"], msg: Message) {

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

        await user.updateOne({ $pull: { followers: data.follower } });
        await currentUser.updateOne({ $pull: { followings: data.following } });

        msg.ack();
    }
}