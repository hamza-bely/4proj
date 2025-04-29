import axios from "axios";
import {toast} from "react-toastify";
import {translateMessage} from "../../assets/i18/translateMessage.tsx";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

export const getAuthHeaders = () => {
    const token = Cookies.get("authToken");
    return {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
    };
};

export const apiRequest = async (method: string, url: string, data?: any) => {
    try {
        const response = await axios({
            method,
            url: `${API_URL}${url}`,
            data,
            headers: getAuthHeaders(),
        });

        if (["post", "patch", "delete"].includes(method)) {
            toast.success(await translateMessage(response.data.message));
        }
        return response.data;
    } catch (error: any) {
        toast.error(await translateMessage(error.response?.data?.message) || await translateMessage("An error has occurred"));
        throw error;
    }
};