import {Redis} from "@upstash/redis";
import {checkSession, unauthorizedResponse} from "../../lib/session.js";
import {sql} from "@vercel/postgres";

const redis = Redis.fromEnv();

export default async (request, response) =>{
    if(request.method !== "GET"){
        response.setHeader("Allow", ["GET"]);
        return response.status(405).json({
            code: "METHOD_NOT_ALLOWED",
            message: "Only POST requests are allowed",
        })
    }

    try {
        const user = await checkSession(request);
        if(user === undefined || user === null){
            console.log("Not connected");
            return unauthorizedResponse(response);
        }

        const payload = request.query;

        if(payload.contactId === undefined || payload.contactId === null){
            return response.status(500).json({
                code: "EMPTY_BODY",
                message: "Empty body"
            })
        }

        const {rowCount} = sql`SELECT username FROM users WHERE user_id = ${payload.contactId}`;

        if (rowCount === 0) {
            return response.status(400).json({
                code: "RECEIVER_NOT_FOUND",
                message: "Receiver not found",
            });
        }

        const [min, max] = [String(user.id), String(payload.contactId)].sort();

        const convKey = `conv:${min}:${max}`;

        const conversation = await redis.lrange(convKey, 0, -1);

        return response.status(200).json(conversation);

    }catch (e) {
        console.error(e);
        return response.status(500).json({
            code: "SERVER_ERROR",
            message: "Server error has occurred"
        });
    }
}