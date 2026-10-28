import {checkSession, getConnecterUser, serverError, unauthorizedResponse} from "../../lib/session.js";
import {Redis} from "@upstash/redis";
import {sql} from "@vercel/postgres";
import PushNotifications from "@pusher/push-notifications-server";

const redis = Redis.fromEnv(process.env.REDIS_URL);

export default async function handler(request, response){
    try{
        const connected = await checkSession(request);
        if(!connected){
            return unauthorizedResponse(response);
        }

        const payload = request.body;

        if(payload.roomId === undefined || typeof payload.roomId !== "number"){
            return response.status(401).json({
                code: "WRONG_BODY",
                message: "Wrong body"
            })
        }

        if(payload.content === undefined || typeof payload.content !== "string" || payload.content.trim() === ""){
            return response.status(401).json({
                code: "WRONG_BODY",
                message: "Wrong body"
            })
        }

        const {rowCount, rows: roomData} = await sql`SELECT * FROM rooms WHERE room_id = ${payload.roomId}`;

        if (rowCount === 0) {
            return response.status(400).json({
                code: "ROOM_NOT_FOUND",
                message: "Room not found",
            });
        }

        const user = await getConnecterUser(request);

        const message = {
            senderId: user.id,
            senderUsername: user.username,
            content: payload.content,
            timestamp: new Date().toISOString()
        }
        const roomKey = `room:${payload.roomId}`;

        await redis.lpush(roomKey, JSON.stringify(message));
        await redis.expire(roomKey, 86400);

        const beamsClient = new PushNotifications({
            instanceId: process.env.PUSHER_INSTANCE_ID,
            secretKey: process.env.PUSHER_SECRET_KEY,
        });

        const {rows} = await sql`SELECT * FROM users WHERE user_id <> ${user.id}`;

        await beamsClient.publishToUsers(rows.map(r => r.external_id), {
            web: {
                notification: {
                    title: `@${user.username}`,
                    body: `Sent a message in ${roomData[0].name}`,
                },
                data: {
                    type: "NEW_MESSAGE",
                    senderId: user.id,
                    roomId: payload.roomId,
                }
            },
        });

        return response.status(200).json({
            message: "Message sent successfully",
        });
    }catch(e){
        console.error(e);
        return serverError(response);
    }
}