import {Redis} from "@upstash/redis";
import {checkSession, unauthorizedResponse} from "../../lib/session.js";
import {sql} from "@vercel/postgres";

export const config = {
    runtime: 'edge',
};

const redis = Redis.fromEnv();

export default async function handler(request) {
    if (request.method !== "GET") {
        return new Response(JSON.stringify({
            code: "METHOD_NOT_ALLOWED",
            message: "Only GET requests are allowed",
        }), {
            status: 405,
            headers: { 'content-type': 'application/json', 'Allow': 'GET' },
        });
    }

    try {
        const user = await checkSession(request);
        if (!user) {
            console.log("Not connected");
            return unauthorizedResponse();
        }

        const { searchParams } = new URL(request.url);
        const roomId = searchParams.get("roomId");

        if (!roomId) {
            return new Response(JSON.stringify({
                code: "EMPTY_BODY",
                message: "Missing roomId parameter",
            }), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }

        const { rowCount } = await sql`SELECT * FROM rooms WHERE room_id = ${roomId}`;

        if (rowCount === 0) {
            return new Response(JSON.stringify({
                code: "ROOM_NOT_FOUND",
                message: "Room not found",
            }), {
                status: 404,
                headers: { 'content-type': 'application/json' },
            });
        }

        const roomKey = `room:${roomId}`;
        const conversation = await redis.lrange(roomKey, 0, -1);
        return new Response(JSON.stringify(conversation), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });

    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({
            code: "SERVER_ERROR",
            message: "Server error has occurred",
        }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}