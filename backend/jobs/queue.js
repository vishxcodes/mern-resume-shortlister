import {Queue} from "bullmq";

const connection = {
    host:"127.0.0.1",
    port:6379,
};

export const rankingQueue = new Queue("rankingQueue", {connection});