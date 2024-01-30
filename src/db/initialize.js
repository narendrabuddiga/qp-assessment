const config = require('../config/config');
//cache
const redis = require('./redis/redis');
//databases
const elephantsql = require('./pg/elephantsql');


module.exports = {
    startConnections: async () => {
        if (config.redisConfig.ENABLE) {''
            await redis.connectRedis();
        }
        if (config.pgConfig.ENABLE) {
            await elephantsql.connectDB();
          //  await elephantsql.executeScripts();
        }
    }
}