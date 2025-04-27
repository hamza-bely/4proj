import {create} from "zustand/react";
import {Route} from "../model/route.tsx";
import {
    createRoute, deleteDefinitiveRouteFoAnAdmin,
    deleteRouteForAnUser,
    fetchRoutes,
    fetchRoutesByUser
} from "../service/itinerary-service.tsx";
interface RouteState {
    routes: Route[];
    route: Route | null;

    routeUser :  Route[];
    fetchRoutesByUser: () => Promise<void>;
    fetchRoutes: () => Promise<void>;
    createRoute: (data: any) => Promise<void>;

    deleteRouteForAnUser: (id: number) => Promise<void>;
    deleteDefinitiveRouteFoAnAdmin: (id: number) => Promise<void>;
}

const useRouteStore = create<RouteState>((set, get) => ({
    routes: [],
    route: null,
    routeUser : [],

    fetchRoutes: async () => {
        const response = await fetchRoutes();
        set({ routes: response.data });
    },

    fetchRoutesByUser: async () => {
        const response = await fetchRoutesByUser();
        set({ routeUser: response.data });
    },

    createRoute: async (data) => {
        const report = await createRoute(data);
        set({ routes: [...get().routes, report] });
    },

    deleteRouteForAnUser: async (id) => {
        await deleteRouteForAnUser(id);
        set((state) => ({
            routeUser: state.routeUser.filter((h) => h.id !== id),
        }));
    },

    deleteDefinitiveRouteFoAnAdmin: async (id) => {
        await deleteDefinitiveRouteFoAnAdmin(id);
        set((state) => ({
            routes: state.routes.filter((h) => h.id !== id),
        }));
    },

}));

export default useRouteStore;
