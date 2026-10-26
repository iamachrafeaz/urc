
import { create } from "zustand";
import type { Session } from "../model/common.ts";
import getStoredSession from "../utils/getStoredSession.ts";

type SessionStore = {
    session: Session | null;
    setSession: (session: Session) => void;
    logout: () => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
    session: getStoredSession(),

    setSession: (session) => {
        sessionStorage.setItem("token", session.token);
        sessionStorage.setItem("username", session.username ?? "");
        sessionStorage.setItem("externalId", session.externalId);
        sessionStorage.setItem("id", String(session.id ?? ""));

        set({
            session,
        });
    },

    logout: () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("id");
        sessionStorage.removeItem("externalId");

        set({
            session: null,
        });
    },
}));
