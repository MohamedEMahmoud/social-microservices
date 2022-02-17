export enum Subjects {

    UserCreated = "user:created",
    UserUpdated = "user:updated",
    UserDeleted = "user:deleted",
    UserFollow = "user:follow",
    UserUnFollow = "user:unfollow",

    AdminCreatedBan = "admin:created:ban",

    ProductCreated = "product:create",
    ProductUpdated = "product:updated",

    OrderCreated = "order:created",
    OrderCancelled = "order:cancelled",

    PaymentCreated = "payment:created",

    ExpirationCompleted = "expiration:completed",
    ExpirationBan = "expiration:ban",
}