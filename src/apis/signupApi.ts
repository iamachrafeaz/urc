import type {ErrorCallback, Session, User} from "../model/common.ts";
import {CustomError} from "../model/CustomError.ts";

export function signupUser(user: User, onResult: () => void, onError: ErrorCallback){
    fetch("/api/auth/signup",{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(user)
    }).then(async (response) => {
        if(response.ok){
            const session = await response.json() as Session;
            sessionStorage.setItem('token', session.token);
            sessionStorage.setItem('externalId', session.externalId);
            sessionStorage.setItem('username', session.username || "");
            onResult()
        }else{
            const error = await response.json() as CustomError;
            onError(error);
        }
    }, onError)
}