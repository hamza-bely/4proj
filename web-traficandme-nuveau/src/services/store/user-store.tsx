import { create } from "zustand";
import {User} from "../model/user.tsx";

interface UserState {
    users: User[];
    user: User | null;
    loading: boolean;

}

const useUserStore = create<UserState>((set) => ({
    users: [],
    user: null ,
    loading : false,




}));

export default useUserStore;
