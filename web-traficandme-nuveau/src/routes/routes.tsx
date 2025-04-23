import { Routes, Route } from "react-router-dom";
import Home from "../page/public/home/home.tsx";
import Map from "../page/public/map/map/map.tsx";
import AuthGuardAdmin from "./auth-guard-admin.tsx";
import ListUserAdmin from "../page/admin/user/list-user-admin.tsx";
import AuthGuard from "./auth-guard.tsx";
import ProfileUser from "../page/user/profile-user.tsx";
import TomTomApiDashboard from "../page/admin/dashboard/dashboard.tsx";
import ListReportAdmin from "../page/admin/report/list-report-admin.tsx";
import ListRouteAdmin from "../page/admin/routes/list-route-admin.tsx";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route
                path="/admin/management-users"
                element={
                    <AuthGuardAdmin>
                        <ListUserAdmin/>
                    </AuthGuardAdmin>
                }
            />
            <Route
                path="/admin/management-report"
                element={
                    <AuthGuardAdmin>
                        <ListReportAdmin/>
                    </AuthGuardAdmin>
                }
            />
            <Route
                path="/admin/dashboard"
                element={
                    <AuthGuardAdmin>
                        <TomTomApiDashboard/>
                    </AuthGuardAdmin>
                }
            />

            <Route
                path="/admin/management-routes"
                element={
                    <AuthGuardAdmin>
                        <ListRouteAdmin/>
                    </AuthGuardAdmin>
                }
            />

            <Route
                path="/profile"
                element={
                    <AuthGuard>
                        <ProfileUser/>
                    </AuthGuard>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
