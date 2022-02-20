import { Listener, Subjects, CommentUpdatedEvent } from "@mesocial/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Comment } from "../../models/comment.model";

export class CommentUpdatedListener extends Listener<CommentUpdatedEvent> {
    readonly subject = Subjects.CommentUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data: CommentUpdatedEvent["data"], msg: Message) {

        const comment = await Comment.findOne({
            id: data.id,
            version: data.version - 1

        });

        if (!comment) {
            throw new Error("Comment Not Found");
        }

        if (comment.replies.length > Number(data.replyArrayLength)) {
            comment.replies = comment.replies.filter(reply => reply !== data.replyId);
        } else {
            comment.replies = [...comment.replies, String(data.replyId)];
        }

        await comment.save();

        msg.ack();
    }
}