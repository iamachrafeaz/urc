
import {
    AUTHENT_HEADER,
    type ErrorCallback,
    type Session,
    type Room,
} from "../model/common.ts";

export function getRoomsList(
    session: Session,
    onResult: (rooms: Room[]) => void,
    onError: ErrorCallback
) {
    fetch("/api/rooms/all", {
        method: "GET",
        headers: {
            [AUTHENT_HEADER]: session.token,
        },
    }).then(async (response) => {
        if (!response.ok) {
            const error = (await response.json());
            onError(error);
            return;
        }

        const data = (await response.json()) as Room[];
        onResult(data);
    },onError);
}
