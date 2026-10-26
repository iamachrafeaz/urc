import { create } from "zustand";
import type { User } from "../model/common";

type UsersStore = {
    users: User[];
    isLoading: boolean;
    setUsers: (users: User[]) => void;
    setIsLoading: (isLoading: boolean) => void;
};

export const useUsersStore = create<UsersStore>((set) => ({
    users: [],
    isLoading: false,

    setUsers: (users) => set({ users }),
    setIsLoading: (isLoading) => set({ isLoading }),
}));