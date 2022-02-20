import { Listener, Subjects, CommentCreatedEvent } from "@mesocial/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Comment } from "../../models/comment.model";

export class CommentCreatedListener extends Listener<CommentCreatedEvent> {
    readonly subject = Subjects.CommentCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: CommentCreatedEvent["data"], msg: Message) {

        const comment = Comment.build({
            id: data.id,
            userId: data.userId,
            post: data.postId,
            product: data.productId,
            version: data.version
        });


        await comment.save();

        msg.ack();
    }
}