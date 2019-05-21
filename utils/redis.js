//redis

// start server: redis-server --daemonize
const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient(
    process.env.REDIS_URL || {
        host: "localhost",
        port: 6379
    }
);
client.on("error", err => {
    console.log(err);
});
//define promises and other behaviors
exports.get = promisify(client.get).bind(client);
exports.setex = promisify(client.setex).bind(client);
exports.del = promisify(client.del).bind(client);

exports.store = {};
if (process.env.REDIS_URL) {
    store = {
        url: process.env.REDIS_URL
    };
} else {
    store = {
        ttl: 3600, //time to live
        host: host,
        port: 6379
    };
}

/*
import redis.js into routes profiles
*/
//key, time, value >
redis.setex("key", 10, "value").then(() => {
    redis.get("key").then(data => {
        console.log(data);
    });
});
//caching
app.get("/something", (req, res) => {
    redis.get("something").then(data => {
        if (!data) {
            //db query
        } else {
            //regular path using redis data
        }
    });
});
