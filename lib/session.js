import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function getConnecterUser(request) {
    let token = new Headers(request.headers).get('Authorization');
    if (token === undefined || token === null || token === "") {
        return null;
    } else {
        token = token.replace("Bearer ", "");
    }
    console.log("checking " + token);

    const user = await redis.get(token);

    if (!user) {
        console.log("User not found");
        return null;
    }

    console.log("Got user : " + user.username);
    return user;
}

export async function checkSession(request) {
    const user = await getConnecterUser(request);
    console.log(user);
    return (user !== undefined && user !== null && user);
}

export function unauthorizedResponse() {
    const error = {code: "SESSION_EXPIRED", message: "Session expired"};
    return new Response(JSON.stringify(error), {
        status: 401,
        headers: {'content-type': 'application/json'},
    });
}

export function triggerNotConnected(res) {
    res.status(401).json("{code: \"SESSION_EXPIRED\", message: \"Session expired\"}");
}

export function serverError(res) {
    res.status(401).json("{code: \"SERVER_ERROR\", message: \"Server error has occurred\"}");
}