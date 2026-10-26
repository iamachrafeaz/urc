
import {
    AUTHENT_HEADER,
    type ErrorCallback,
    type Session,
    type User,
} from "../model/common.ts";

export function getUsersList(
    session: Session,
    onResult: (users: User[]) => void,
    onError: ErrorCallback
) {
    fetch("/api/users/all", {
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

            const data = (await response.json()) as User[];
            onResult(data);
    },onError);
}
