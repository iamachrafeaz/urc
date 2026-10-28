import {checkSession, unauthorizedResponse} from "../../lib/session.js";
import {sql} from "@vercel/postgres";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const connected = await checkSession(request);

        if (!connected) {
            console.log("Not connected");
            return unauthorizedResponse();
        }

        const { rows } = await sql`SELECT * FROM rooms`;

        return new Response(JSON.stringify(rows), {
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