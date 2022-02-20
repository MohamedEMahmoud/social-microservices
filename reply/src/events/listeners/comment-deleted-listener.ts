import { Listener, Subjects, CommentDeletedEvent } from "@mesocial/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Comment } from "../../models/comment.model";
import { Reply } from "../../models/reply.model";

export class CommentDeletedListener extends Listener<CommentDeletedEvent> {
    readonly subject = Subjects.CommentDeleted;
    queueGroupName = queueGroupName;
    async onMessage(data: CommentDeletedEvent["data"], msg: Message) {
        const comment = await Comment.findByIdAndDelete(data.id);

        if (!comment) {
            throw new Error("Comment Not Found");
        }

        // when delete comment delete all replies has related this comment from reply model
        if (comment.replies.length > 0) {
            await Reply.deleteMany({ comment: comment.id });
        }

        msg.ack();
    }
}