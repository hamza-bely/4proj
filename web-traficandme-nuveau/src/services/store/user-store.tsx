import {User, UserCreateRequest, UserUpdaterRequest} from "../model/user.tsx";
import {
    fetchUser,
    fetchUsers,
    createUser,
    updateUserByAdmin,
    deleteUserForAnUser
} from "../service/user-service.tsx";
import { create } from "zustand";
import {deleteDefinitiveUserFoAnAdmin, deleteUserFoAnAdmin} from "../service/admin-serivce.tsx";

interface UserState {
    users: User[];
    user: User | null;
    fetchUsers: () => Promise<void>;
    fetchUser: () => Promise<void>;
    createUser : (params: UserCreateRequest) => Promise<void>;
    updateUserByAdmin : (id: number, params : UserUpdaterRequest) => Promise<void>;

    deleteUserForAnUser: (id: number) => Promise<void>;
    deleteUserForAnAdmin: (id: number) => Promise<void>;
    deleteDefinitiveUserFoAnAdmin: (id: number) => Promise<void>;

}

const useUserStore = create<UserState>((set) => ({
    users: [],
    user: null ,

    fetchUsers: async () => {
            const response = await fetchUsers();
            set({ users: response.data });
    },

    fetchUser: async () => {
            const response = await fetchUser();
            set({ user : response.data })
    },

    createUser: async (userData) => {
        const response = await createUser(userData);
        set((state) => ({
            users: [...state.users, response.data],
        }));
    },

    updateUserByAdmin: async ( id,params)  => {
            const response  = await updateUserByAdmin(id,params);
            set((state ) => ({
                users: state.users.map((h) => (h.id === response.data.id ? response.data : h)),
            }));
    },

    deleteUserForAnUser: async (id) => {
            await deleteUserForAnUser();
            set((state) => ({
                users: state.users.filter((h) => h.id !== id),
            }));
    },

    deleteUserForAnAdmin: async (id)  => {
        const response  = await deleteUserFoAnAdmin(id);
        set((state ) => ({
            users: state.users.map((h) => (h.id === response.data.id ? response.data : h)),
        }));
    },

    deleteDefinitiveUserFoAnAdmin: async (id) => {
        await deleteDefinitiveUserFoAnAdmin(id);
        set((state) => ({
            users: state.users.filter((h) => h.id !== id),
        }));
    },

}));

export default useUserStore;