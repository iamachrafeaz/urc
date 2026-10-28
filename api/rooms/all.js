import {checkSession, serverError, unauthorizedResponse} from "../../lib/session.js";
import {sql} from "@vercel/postgres";

export default async function handler(request, response){
    try{
        const connected = await checkSession(request);

        if(!connected){
            console.log("Not connect")
            return unauthorizedResponse();
        }

        const {rows} = await sql`SELECT * FROM rooms`;

        return response.status(200).json(rows);
    }catch (e) {
        return serverError(response);
    }
}