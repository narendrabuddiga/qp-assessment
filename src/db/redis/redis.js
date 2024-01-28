const redis = require("redis");
const config = require('../../config/config')
const redisClient = redis.createClient({
    password: config.redisConfig.PASS,
    socket: {
        host: config.redisConfig.HOST,
        port: config.redisConfig.PORT
    }
});

const connectRedis = async () => {
    // handle error
    redisClient.on('error', (err) => {
        console.error(`An error occurred with Redis: ${err}`)
    })
    redisClient.on("ready", () => {
        console.log("Redis connected successfully..");
    });
    console.log("Connecting to the Redis");

    await redisClient.connect();

    await redisClient.ping();
}

const setValue = (key, value) => {
    redisClient.set(key, value, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
    return 'done';
}

const getValue = async (key) => {
    return await redisClient.get(key);
}

const cleanUp = async () => {
    return await redisClient.flushAll();
}

const getAllKeys = async () => {
    return await redisClient.keys('*');
}
const getAllCacheData = async () => {
    let response = []
    let existingKeys = await getAllKeys();
    for (let key of existingKeys) {
        let data = await getValue(key);
        response.push({ [key]: data })
    }
    return response;
}

module.exports = {
    connectRedis,
    setValue, getValue, cleanUp, getAllCacheData
}