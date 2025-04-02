import { Routes, Route } from "react-router-dom";
import Home from "../page/public/home/home.tsx";
import Map from "../page/public/map/map/map.tsx";
import MapComponent from "../page/public/map/map/map.tsx";
import AuthGuardAdmin from "./auth-guard-admin.tsx";
import ListUserAdmin from "../page/admin/user/list-user-admin.tsx";
import AuthGuard from "./auth-guard.tsx";
import Profile from "../page/user/profile.tsx";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/about" element={<MapComponent />} />
            <Route
                path="/admin/management-users"
                element={
                    <AuthGuardAdmin>
                        <ListUserAdmin/>
                    </AuthGuardAdmin>
                }
            />

            <Route
                path="/profile"
                element={
                    <AuthGuard>
                        <Profile/>
                    </AuthGuard>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
