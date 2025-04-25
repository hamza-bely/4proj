import {ChartPieIcon} from "@heroicons/react/16/solid";
import {FaRoute, FaUserShield} from "react-icons/fa";
import {MdReportProblem} from "react-icons/md";

export const routesAdmin = [
    { name: 'Dashboard', href: 'admin/dashboard', icon: ChartPieIcon },
    { name: 'utilisateurs', href: '/admin/management-users', icon: FaUserShield },
    { name: 'Report', href: '/admin/management-report', icon: MdReportProblem },
    { name: 'Route', href: '/admin/management-routes', icon: FaRoute }
];

export const routesModerator = [
    { name: 'Dashboard', href: 'admin/dashboard', icon: ChartPieIcon },
    { name: 'Report', href: '/admin/management-report', icon: MdReportProblem },
];