import {checkSession, getConnecterUser, unauthorizedResponse} from "../../lib/session.js";
import {Redis} from "@upstash/redis";
import {sql} from "@vercel/postgres";
import {publishBeamsNotification} from "../../lib/beams.js";

export const config = {
    runtime: 'edge',
};

const redis = Redis.fromEnv(process.env.REDIS_URL);

export default async function handler(request) {
    if (request.method !== "POST") {
        return new Response(JSON.stringify({ code: "METHOD_NOT_ALLOWED", message: "Only POST requests are allowed" }), {
            status: 405,
            headers: { 'content-type': 'application/json', 'Allow': 'POST' },
        });
    }

    try {
        const connected = await checkSession(request);
        if (!connected) {
            return unauthorizedResponse();
        }

        const payload = await request.json();

        if (payload.roomId === undefined || typeof payload.roomId !== "number") {
            return new Response(JSON.stringify({ code: "WRONG_BODY", message: "Wrong body" }), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }

        if (payload.content === undefined || typeof payload.content !== "string" || payload.content.trim() === "") {
            return new Response(JSON.stringify({ code: "WRONG_BODY", message: "Wrong body" }), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }

        const { rowCount, rows: roomData } = await sql`SELECT * FROM rooms WHERE room_id = ${payload.roomId}`;

        if (rowCount === 0) {
            return new Response(JSON.stringify({ code: "ROOM_NOT_FOUND", message: "Room not found" }), {
                status: 404,
                headers: { 'content-type': 'application/json' },
            });
        }

        const user = await getConnecterUser(request);

        const message = {
            senderId: user.id,
            senderUsername: user.username,
            content: payload.content,
            timestamp: new Date().toISOString()
        };
        const roomKey = `room:${payload.roomId}`;

        await redis.lpush(roomKey, JSON.stringify(message));
        await redis.expire(roomKey, 86400);

        const { rows } = await sql`SELECT * FROM users WHERE user_id <> ${user.id}`;
        const externalIds = rows.map(r => r.external_id).filter(Boolean);

        if (process.env.PUSHER_INSTANCE_ID && process.env.PUSHER_SECRET_KEY && externalIds.length > 0) {
            await publishBeamsNotification(
                process.env.PUSHER_INSTANCE_ID,
                process.env.PUSHER_SECRET_KEY,
                externalIds,
                {
                    title: `@${user.username}`,
                    body: `Sent a message in ${roomData[0].name}`,
                },
                {
                    type: "NEW_MESSAGE",
                    senderId: user.id,
                    roomId: payload.roomId,
                }
            );
        }

        return new Response(JSON.stringify({ message: "Message sent successfully" }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ code: "SERVER_ERROR", message: "Server error has occurred" }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}