import {apiRequest} from "./generic-service.tsx";

export const fetchRoutes = async (): Promise<any> => {
    return await apiRequest("get", "traffic/get-all");
};

export const fetchRoutesByUser = async (): Promise<any> => {
    return await apiRequest("get", "traffic/user");
};

export const createRoute = async (params: any): Promise<any> => {
    return await apiRequest("post", "traffic/create", params);
};

export const deleteRouteForAnUser = async (id: number): Promise<void> => {
    await apiRequest("delete", `traffic/${id}/delete-for-an-user`);
};

export const deleteDefinitiveRouteFoAnAdmin = async (id: number): Promise<any> => {
    return await apiRequest("delete", `traffic/${id}/delete-definitive`);
};
