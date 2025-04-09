import {Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel} from "@headlessui/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import useUserStore from "../../services/store/user-store.tsx";
import Languages  from "../languages/languages.tsx";
import {
    ChartPieIcon, ChevronDownIcon,
} from "@heroicons/react/16/solid";
import {FaRoute, FaUserShield} from "react-icons/fa";
import {MdReportProblem} from "react-icons/md";

interface DesktopHeaderProps {
    role: string | string[] | null;
    navigationLinks: { name: string; href: string }[];
    openLogin: () => void;
    openRegister: () => void;
}

const solutions = [
    { name: 'Dashboard', href: 'admin/dashboard', icon: ChartPieIcon },
    { name: 'utilisateurs',  href: '/admin/management-users', icon: FaUserShield},
    { name: 'Report', href: '/admin/management-report', icon: MdReportProblem   },
    { name: 'Route', href: '/admin/management-routes', icon: FaRoute }
]

export default function DesktopHeader({ role, navigationLinks, openLogin, openRegister }: DesktopHeaderProps) {
    const { t } = useTranslation();
    const { user } = useUserStore();
    const languageOptions = [
        { name: "fr", label: "Français", img: "/flags/fr.svg" },
        { name: "en", label: "English", img: "/flags/gb.svg" },
    ];

    const getInitials = (username: string) => {
        return username ? username.charAt(0).toUpperCase() : "";
    };

    function handleLogout() {
        Cookies.remove("authToken");
        window.location.reload();
    }

    return (
        <div className="hidden lg:flex flex-1 justify-between items-center">
            <div className="flex gap-x-12">
                {navigationLinks.map((item) => (
                    <Link key={item.name} to={item.href}
                          className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                        {item.name}
                    </Link>
                ))}

                {role == "ROLE_ADMIN" &&
                    <div>
                        <Popover className="relative">
                            <PopoverButton className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                                <span className="cursor-pointer text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">{t('admin')}</span>
                                <ChevronDownIcon aria-hidden="true" className="size-5" />
                            </PopoverButton>

                            <PopoverPanel
                                transition
                                className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                            >
                                <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 ring-1 shadow-lg ring-gray-900/5">
                                    <div className="p-4">
                                        {solutions.map((item) => (
                                            <Link to={item.href} className="cursor-pointer group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                                <div className="mt-1 flex size-6 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                    <item.icon aria-hidden="true" className=" text-gray-600 group-hover:text-indigo-600" />
                                                </div>
                                                <div>
                                                    <button className="font-semibold text-gray-900">
                                                        {item.name}
                                                        <span className="absolute inset-0" />
                                                    </button>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </PopoverPanel>
                        </Popover>
                    </div>
                }

            </div>
            <Link to="/" className="-m-1.5">
                <img className="h-12 w-auto" src="/images/logo/logo_2.png" alt="Logo"/>
            </Link>

            <div className="flex items-center">
                {role ? (
                    <Menu as="div" className="relative ml-3">
                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm">
                            <span
                                className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                                {getInitials(user?.username || "")}
                            </span>
                        </MenuButton>
                        <MenuItems style={{zIndex: 1001}}
                            className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                            <MenuItem>
                                {({active}) => (
                                    <Link to="/profile"
                                          className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}>
                                        {t("profile.title")}
                                    </Link>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({active}) => (
                                    <button onClick={handleLogout}
                                            className={`block w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}>
                                        {t("logout")}
                                    </button>
                                )}
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                ) : (
                    <div className="flex gap-5">
                        <button onClick={openRegister} className="cursor-pointer text-sm font-semibold text-gray-900">
                            {t("header.register")}
                        </button>
                        <button onClick={openLogin} className="cursor-pointer text-sm font-semibold text-gray-900">
                            {t("header.login")} <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                )}
                <Languages languages={languageOptions}  />
            </div>
        </div>
    );
}
