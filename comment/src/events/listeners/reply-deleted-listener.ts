import { Listener, Subjects, ReplyDeletedEvent } from "@mesocial/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Comment } from "../../models/comment.model";
import { CommentUpdatedPublisher } from "../publishers/comment-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ReplyDeletedListener extends Listener<ReplyDeletedEvent> {
    readonly subject = Subjects.ReplyDeleted;
    queueGroupName = queueGroupName;
    async onMessage(data: ReplyDeletedEvent["data"], msg: Message) {
        const comment = await Comment.findById(data.commentId);

        if (!comment) {
            throw new Error("Comment Not Found");
        }

        comment.replies = comment.replies.filter(reply => reply !== data.id);

        const commentData = await comment.save();

        if (commentData) {
            await new CommentUpdatedPublisher(natsWrapper.client).publish({
                id: commentData.id,
                replyId: data.id,
                version: commentData.version,
            });
        }

        msg.ack();
    }
}