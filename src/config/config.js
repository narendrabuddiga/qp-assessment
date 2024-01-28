module.exports = {
  database_url: process.env.DATABASE_URL,
  PORT: process.env.DEV_PORT || 8080,
  jwt: {
    SECRET_KEY: process.env.JWT_SECRET_KEY,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN
  },
  pgConfig: {
    ENABLE: true,
    HOST: process.env.PG_HOST,
    USER: process.env.PG_USER,
    PASSWORD: process.env.PG_PASSWORD,
    SCHEMA: 'supply_management',
    PORT: process.env.PG_PORT,
  },
  redisConfig: {
    ENABLE: false,
    HOST: process.env.REDIS_HOST,
    PORT: process.env.REDIS_PORT,
    PASS: process.env.REDIS_PASSWORD,
  }
};