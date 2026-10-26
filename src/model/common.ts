import {CustomError} from "./CustomError";

export const AUTHENT_HEADER = "Authorization";
export const BEARER = "Bearer ";

export interface User {
    user_id: number;
    username: string;
    email?: string;
    password: string;
    last_login?: string;
    external_id?: string;
}

export interface Session {
    token: string;
    username?: string;
    id?: number;
    externalId: string;
}

export interface Message {
    senderId: number,
    content: string,
    timestamp: string
}

export interface EmptyCallback {
    (): void;
}

export interface ErrorCallback {
    (error: CustomError): void;
}

