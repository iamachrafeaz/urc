import {checkSession, unauthorizedResponse} from "../../lib/session.js";
import {sql} from "@vercel/postgres";
import { Redis } from '@upstash/redis';
import PushNotifications from "@pusher/push-notifications-server";

const redis = Redis.fromEnv();

export default async (request, response) => {
    if(request.method !== "POST"){
        response.setHeader("Allow", ["POST"]);
        return response.status(405).json({
            code: "METHOD_NOT_ALLOWED",
            message: "Only POST requests are allowed",
        })
    }

    try {
        const user = await checkSession(request);
        if (user === undefined || user === null) {
            console.log("Not connected");
            return unauthorizedResponse(response);
        }

        const payload = request.body;

        if (
            typeof payload.message !== "string" ||
            payload.message.trim() === ""
        ) {
            return response.status(400).json({
                code: "EMPTY_MESSAGE",
                message: "Empty message",
            });
        }

        if (
            payload.receiverId == null ||
            String(payload.receiverId).trim() === ""
        ) {
            return response.status(400).json({
                code: "NO_RECEIVER_ID",
                message: "No receiver id",
            });
        }

        const { rowCount, rows } = await sql`SELECT username, external_id FROM users WHERE user_id = ${payload.receiverId}`;

        if (rowCount === 0) {
            return response.status(400).json({
                code: "RECEIVER_NOT_FOUND",
                message: "Receiver not found",
            });
        }

        const [min, max] = [
            String(user.id),
            String(payload.receiverId),
        ].sort();

        const convKey = `conv:${min}:${max}`;

        const message = {
            senderId: user.id,
            content: payload.message,
            timestamp: new Date().toISOString()
        }

        await redis.lpush(convKey, JSON.stringify(message));
        await redis.expire(convKey, 86400);

        const beamsClient = new PushNotifications({
            instanceId: process.env.PUSHER_INSTANCE_ID,
            secretKey: process.env.PUSHER_SECRET_KEY,
        });

        await beamsClient.publishToUsers([rows[0].external_id], {
            web: {
                notification: {
                    title: `@${user.username}`,
                    body: "Sent you a message",
                },
                data: {
                    type: "NEW_MESSAGE",
                    senderId: user.id
                }
            },
        });

        return response.status(200).json({
            message: "Message sent successfully",
        });
    } catch (error) {
        console.log(error);
        response.status(500).json(error);
    }
};
