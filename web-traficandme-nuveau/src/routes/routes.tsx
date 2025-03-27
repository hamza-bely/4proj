import { Routes, Route } from "react-router-dom";
import Home from "../page/public/home/home.tsx";
import Map from "../page/public/map/map/map.tsx";
import MapComponent from "../page/public/map/map/map.tsx";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/about" element={<MapComponent />} />
            {/*<Route
                path="/admin/gestion-users"
                element={
                    <AuthGuardAdmin>
                        <ListUserAdmin/>
                    </AuthGuardAdmin>
                }
            />
                <Route
                path="/admin/gestion-tickets"
                element={
                <AuthGuardAdmin>
                <ListTicketsAdmin/>
               </AuthGuardAdmin>

        />*/}

        </Routes>
    );
};

export default AppRoutes;
