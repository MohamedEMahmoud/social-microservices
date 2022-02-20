import { Listener, Subjects, PostDeletedEvent } from "@mesocial/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Post } from "../../models/post.model";
import { Comment } from "../../models/comment.model";

export class PostDeletedListener extends Listener<PostDeletedEvent> {
    readonly subject = Subjects.PostDeleted;
    queueGroupName = queueGroupName;
    async onMessage(data: PostDeletedEvent["data"], msg: Message) {

        const post = await Post.findByIdAndDelete(data.id);

        if (!post) {
            throw new Error("Post Not Found");
        }

        // when delete post delete all comments has related this post from comment model 
        if (post.comments.length > 0) {
            await Comment.deleteMany({ post: post.id });
        }
        msg.ack();
    }
}