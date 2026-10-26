import { create } from "zustand";
import type {Message} from "../model/common.ts";

type ConversationStore = {
    selectedUserId: string | null
    messages: Message[]
    isLoading: boolean

    selectConversation: (userId: string) => void
    setMessages: (messages: Message[]) => void
    addMessage: (message: Message) => void
    setLoading: (loading: boolean) => void
}

export const useConversationStore = create<ConversationStore>((set) => ({
    selectedUserId: null,
    messages: [],
    isLoading: false,

    selectConversation: (userId) =>
        set({
            selectedUserId: userId,
            messages: [],
        }),

    setMessages: (messages) => set({ messages }),

    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message],
        })),

    setLoading: (isLoading) => set({ isLoading }),
}))