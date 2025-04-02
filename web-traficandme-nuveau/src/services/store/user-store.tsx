import {User, UserComplete, UserCreateRequest} from "../model/user.tsx";
import {fetchUser, fetchUsers, createUser, updateUser} from "../service/user-service.tsx";
import { create } from "zustand";

interface UserState {
    users: User[];
    user: User | null;
    fetchUsers: () => Promise<void>;
    fetchUser: () => Promise<void>;
    createUser : (params: UserCreateRequest) => Promise<void>;
    updateUser : (id: number, params : UserComplete) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
    users: [],
    user: null ,

    fetchUsers: async () => {
        try {
            const response = await fetchUsers();
            set({ users: response.data });
        } catch (error) {
            console.error(error);
        }
    },

    fetchUser: async () => {
        try {
            const response = await fetchUser();
            set({ user : response.data });
        } catch (error) {
            console.error(error);
        }
    },

    createUser: async (userData) => {
        const response = await createUser(userData);
        set((state) => ({
            users: [...state.users, response.data],
        }));
    },

    updateUser: async ( id,params)  => {
        try {
            const response  = await updateUser(id,params);
            set((state ) => ({
                users: state.users.map((h) => (h.id === response.data.id ? response.data : h)),
                user: response.data,
            }));
        } catch (error) {
            console.error(error);
        }
    },

    deleteUser: async (id) => {
        set({ loading: true });
        try {
            await deleteUser(id);
            set((state) => ({
                users: state.users.filter((h) => h.auth_service_user_id !== id),
                user: state.user?.auth_service_user_id === id ? null : state.user,
            }));
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
        } finally {
            set({ loading: false });
        }
    },

}));

export default useUserStore;