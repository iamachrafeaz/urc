import {checkSession, unauthorizedResponse} from "../../lib/session.js";
import {sql} from "@vercel/postgres";
import { Redis } from '@upstash/redis';
import {publishBeamsNotification} from "../../lib/beams.js";

export const config = {
    runtime: 'edge',
};

const redis = Redis.fromEnv();

export default async function handler(request) {
    if (request.method !== "POST") {
        return new Response(JSON.stringify({ code: "METHOD_NOT_ALLOWED", message: "Only POST requests are allowed" }), {
            status: 405,
            headers: { 'content-type': 'application/json', 'Allow': 'POST' },
        });
    }

    try {
        const user = await checkSession(request);
        if (!user) {
            console.log("Not connected");
            return unauthorizedResponse();
        }

        const payload = await request.json();

        if (
            typeof payload.message !== "string" ||
            payload.message.trim() === ""
        ) {
            return new Response(JSON.stringify({
                code: "EMPTY_MESSAGE",
                message: "Empty message",
            }), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }

        if (
            payload.receiverId == null ||
            String(payload.receiverId).trim() === ""
        ) {
            return new Response(JSON.stringify({
                code: "NO_RECEIVER_ID",
                message: "No receiver id",
            }), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }

        const { rowCount, rows } = await sql`SELECT username, external_id FROM users WHERE user_id = ${payload.receiverId}`;

        if (rowCount === 0) {
            return new Response(JSON.stringify({
                code: "RECEIVER_NOT_FOUND",
                message: "Receiver not found",
            }), {
                status: 404,
                headers: { 'content-type': 'application/json' },
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
        };

        await redis.lpush(convKey, JSON.stringify(message));
        await redis.expire(convKey, 86400);

        if (process.env.PUSHER_INSTANCE_ID && process.env.PUSHER_SECRET_KEY && rows[0].external_id) {
            await publishBeamsNotification(
                process.env.PUSHER_INSTANCE_ID,
                process.env.PUSHER_SECRET_KEY,
                [rows[0].external_id],
                {
                    title: `@${user.username}`,
                    body: "Sent you a message",
                },
                {
                    type: "NEW_MESSAGE",
                    senderId: user.id
                }
            );
        }

        return new Response(JSON.stringify({
            message: "Message sent successfully",
        }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({
            code: "SERVER_ERROR",
            message: "Server error has occurred",
        }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}
