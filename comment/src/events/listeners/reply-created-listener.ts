import { Listener, Subjects, ReplyCreatedEvent } from "@mesocial/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Comment } from "../../models/comment.model";
import { CommentUpdatedPublisher } from "../publishers/comment-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ReplyCreatedListener extends Listener<ReplyCreatedEvent> {
    readonly subject = Subjects.ReplyCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: ReplyCreatedEvent["data"], msg: Message) {
        const comment = await Comment.findById(data.commentId);

        if (!comment) {
            throw new Error("Comment Not Found");
        }

        comment.replies = [...comment.replies, data.id];

        const commentData = await comment.save();

        if (commentData) {
            await new CommentUpdatedPublisher(natsWrapper.client).publish({
                id: commentData.id,
                replyId: data.id,
                replyArrayLength: comment.replies.length,
                version: commentData.version
            });
        }

        msg.ack();
    }
}