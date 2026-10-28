import {AUTHENT_HEADER, type Message, type Session, type ErrorCallback, type EmptyCallback,} from "../model/common.ts";
import {CustomError} from "../model/CustomError.ts";

export function getRoomConversation(roomId: number, session: Session, onResult: (messages: Message[])=> void,  onError: ErrorCallback){
    fetch(`/api/rooms/get?roomId=${roomId}`, {
        method: "GET",
        headers: {
            [AUTHENT_HEADER]: session.token,
        }
    }).then(async (response) => {
        if(response.ok){
            const messages = await response.json() as Message[];
            onResult(messages.reverse());
        }else{
            const error = await response.json() as CustomError;
            onError(error);
        }
    })
}

export function sendRoomMessage(message: {content: string, roomId: number}, session: Session, onResult: EmptyCallback,  onError: ErrorCallback){
    fetch("/api/rooms/send", {
        method: "POST",
        headers: {
            [AUTHENT_HEADER]: session.token,
            "Content-type": "application/json"
        },
        body: JSON.stringify(message)
    }).then(async (response) => {
        if(!response.ok){
            const error = await response.json() as CustomError;
            onError(error);
        }else{
            onResult();
        }
    })
}