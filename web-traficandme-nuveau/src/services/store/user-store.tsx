import { create } from "zustand";
import {User, UserRegisterRequest} from "../model/user.tsx";
import {fetchUsers} from "../service/user-service.tsx";

interface UserState {
    users: User[];
    user: User | null;
    loading: boolean;
    isLoading : boolean;
    fetchUsers: () => Promise<void>;
    fetchUser: (id : number,role : string | undefined) => Promise<User | null>;
    createUser : (params: UserRegisterRequest) => Promise<void>;
    updateUser : (id: number, params : any) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
    resetStore : () => void;
}

const useUserStore = create<UserState>((set) => ({
    users: [],
    user: null ,
    loading : false,
    isLoading : false,

    fetchUsers: async () => {
        set({ isLoading: true });
        try {
            const response = await fetchUsers();
            set({ users: response, isLoading: false });
        } catch (error) {
            console.error(error);
            set({ isLoading: false });
        }
    },


    fetchUser: async (role): Promise<User | null> => {
        try {
            const response = await fetchUser();
            const user = { ...response, role };
            set({ user });
            return response;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    createUser: async (userData) => {
        const response = await register(userData);
        set((state) => ({
            users: [...state.users, response.user],
        }));
    },

    updateUser: async ( id,params)  => {
        set({ loading: true });
        try {
            const responseNewUser  = await updateUser(id,params);

            set((state ) => ({
                users: state.users.map((h) => (h._id === responseNewUser.id ? responseNewUser.user : h)),
                user: responseNewUser.user,
            }));
            const response = await fetchUsers();
            set({ users: response, isLoading: false });
        } catch (error) {
            console.error(error);

        } finally {
            set({ loading: false });
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

    resetStore: () => {
        set({ user: null, loading: false });
    },




}));

export default useUserStore;
