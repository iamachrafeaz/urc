import type { Room } from "../model/common"
import {create} from "zustand";

type RoomsStore = {
    rooms: Room[],
    isLoading: boolean;
    setRooms: (rooms: Room[]) => void;
    setIsLoading: (isLoading: boolean) => void;
}

export const useRoomsStore = create<RoomsStore>(set => ({
    rooms: [],
    setRooms: (rooms: Room[]) => set({rooms}),
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading })
}))