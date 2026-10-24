// stores/session.ts
import { create } from "zustand";

type SessionStore = {
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
    token: sessionStorage.getItem("token"),

    setToken: (token) => {
        if (token) {
            sessionStorage.setItem("token", token);
        } else {
            sessionStorage.removeItem("token");
        }

        set({ token });
    },

    logout: () => {
        sessionStorage.removeItem("token");
        set({ token: null });
    },
}));