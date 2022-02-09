(async () => {
    const Environment = [
        "REDIS_HOST",
    ];
    Environment.forEach(el => {
        if (!process.env[el]) {
            console.log(el);
            throw new Error(`${el} Must Be Defined`);
        }
    });
    try {
        // natsWrapper connect

        //nats Listener

    } catch (err) {
        console.error(err);
    }
})();