export enum Subjects {

    UserCreated = "user:created",
    UserUpdated = "user:updated",
    UserDeleted = "user:deleted",
    UserFollow = "user:follow",
    UserUnFollow = "user:unfollow",

    AdminCreatedBan = "admin:created:ban",

    PostCreated = "post:created",
    PostUpdated = "post:updated",
    PostDeleted = "post:deleted",

    CommentCreated = "comment:created",
    CommentUpdated = "comment:updated",
    CommentDeleted = "comment:deleted",

    ReplyCreated = "reply:created",
    ReplyDeleted = "reply:deleted",

    ProductCreated = "product:created",
    ProductUpdated = "product:updated",

    OrderCreated = "order:created",
    OrderCancelled = "order:cancelled",

    PaymentCreated = "payment:created",

    ExpirationCompleted = "expiration:completed",
    ExpirationBan = "expiration:ban",
}