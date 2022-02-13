export enum Subjects {

    UserCreated = "user:created",
    UserUpdated = "user:updated",
    UserDeleted = "user:deleted",
    UserFollow  = "user:follow",
    UserBan     = "user:ban",

    ProductCreated = "product:create",
    ProductUpdated = "product:updated",

    OrderCreated = "order:created",
    OrderCancelled = "order:cancelled",

    PaymentCreated = "payment:created",

    ExpirationCompleted = "expiration:completed",
    ExpirationBan = "expiration:ban",
}