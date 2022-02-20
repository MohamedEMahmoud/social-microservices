import { Listener, Subjects, PostUpdatedEvent } from "@mesocial/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Post } from "../../models/post.model";

export class PostUpdatedListener extends Listener<PostUpdatedEvent> {
    readonly subject = Subjects.PostUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data: PostUpdatedEvent["data"], msg: Message) {

        const post = await Post.findOne({
            data: data.id,
            version: data.version - 1
        });

        if (!post) {
            throw new Error("Post Not Found");
        }

        if (data.commentId && data.commentArrayLength) {
            if (post.comments.length > Number(data.commentArrayLength)) {
                post.comments = post.comments.filter(comment => comment !== data.commentId);
            } else {
                post.comments = [...post.comments, String(data.commentId)];
            }
        }

        await post.save();

        msg.ack();
    }
}