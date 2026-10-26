import type {Session} from "../model/common.ts";

export default function getStoredSession(): Session | null {
    const token = sessionStorage.getItem("token");

    if (!token) {
        return null;
    }

    return {
        token,
        username: sessionStorage.getItem("username") ?? "",
        id: Number(sessionStorage.getItem("id")) || -1,
        externalId: sessionStorage.getItem("externalId") ?? "",
    };
}
