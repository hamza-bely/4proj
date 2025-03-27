
const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    "Content-Type": "application/json",
});
