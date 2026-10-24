import { db } from '@vercel/postgres';
import {arrayBufferToBase64, stringToArrayBuffer} from "../../lib/base64";
import {Redis} from "@upstash/redis";

export const config = {
    runtime: "edge"
}

const redis = Redis.fromEnv();

const inputValidation = ({username, email, password}) => {
    let error = {code: null, message: null};
    if(username.trim() == "") {
        return error = {code: "MISSING_USERNAME", message: "Username is required."};
    }

    if(email.trim() == "") {
        return error = {code: "MISSING_EMAIL", message: "Email is required."};
    }

    if(password.trim() == "") {
        return error = {code: "MISSING_PASSWORD", message: "Password is required."};
    }

    if(password.length < 8) {
        return error = {code: "SHORT_PASSWORD", message: "Password must contain at least 8 characters."};
    }

    return error;
};

export default async function handler(request){
    try{
        const {username, email, password} = await request.json();

        const validation = inputValidation({username, email, password});

        if(validation.code != null) {
            return new Response(JSON.stringify(validation), {
                status: 400,
                headers: {'content-type': 'application/json'}
            });
        }

        const client = await  db.connect();

        const {rowCount} = await client.sql`SELECT * FROM users WHERE email = ${email} OR username = ${username}`;

        if(rowCount >= 1){
            const error = {code: "ERROR", message: "Identifiant déjà existant!"};
            return new Response(JSON.stringify(error),{
                status: 400,
                headers: {'content-type': 'application/json'}
            });
        }

        const hash = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(username + password));
        const hash64 = arrayBufferToBase64(hash);

        const external_id = crypto.randomUUID();

        const {rows} = await client.query("INSERT INTO users(username, email, password, created_on, last_login, external_id) VALUES ($1, $2, $3, now(), now(), $4) RETURNING *",[username, email, hash64, external_id]);

        const result = rows[0];

        const user = {
            user_id : result.user_id,
            username: result.username,
            email: result.email,
            external_id: result.external_id,
        }

        const token = crypto.randomUUID().toString();

        await redis.set(token, user, {ex: 3600});
        const userInfo = {};
        userInfo[user.user_id] = user;
        await redis.hset("users", userInfo);

        return new Response(JSON.stringify({token: token, username: user.username, externalId: user.external_id, id: user.user_id}),{
            status: 200,
            headers: {'content-type': 'application/json'},
        });
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({code: "SYSTEM_ERROR", message: "System error has occurred."}), {
            status: 500,
            headers: {'content-type': 'application/json'}
        })
    }
}