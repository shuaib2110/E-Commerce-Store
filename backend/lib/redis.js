import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();
// store te refresh token in redis
export const redis = new Redis(process.env.UPSTASH_REDIS_URL);


