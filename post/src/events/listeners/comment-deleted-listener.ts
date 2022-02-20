import { Listener, Subjects, CommentDeletedEvent } from "@mesocial/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Post } from "../../models/post.model";
import { PostUpdatedPublisher } from "../publishers/post-updated-publisher";

export class CommentDeletedListener extends Listener<CommentDeletedEvent> {
    readonly subject = Subjects.CommentDeleted;
    queueGroupName = queueGroupName;
    async onMessage(data: CommentDeletedEvent["data"], msg: Message) {

        if (data.postId) {
            const post = await Post.findById(data.postId);

            if (!post) {
                throw new Error("Post not found");
            }

            post.comments = post.comments.filter(comment => comment !== data.id);

            const postData = await post.save();

            if (postData) {
                await new PostUpdatedPublisher(this.client).publish({
                    id: postData.id,
                    commentArrayLength: postData.comments.length,
                    commentId: data.id,
                    version: postData.version
                });
            }
        }

        msg.ack();
    }
}