import {Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel} from "@headlessui/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import useUserStore from "../../services/store/user-store.tsx";
import Languages  from "../languages/languages.tsx";
import {ChevronDownIcon
} from "@heroicons/react/16/solid";
import {routesAdmin, routesModerator} from "./navigation.tsx";

interface DesktopHeaderProps {
    role: string | string[] | null;
    navigationLinks: { name: string; href: string }[];
    openLogin: () => void;
    openRegister: () => void;
}

export default function DesktopHeader({ role, navigationLinks, openLogin, openRegister }: DesktopHeaderProps) {
    const { t } = useTranslation();
    const { user } = useUserStore();
    const getInitials = (username: string) => {
        return username ? username.charAt(0).toUpperCase() : "";
    };

    function handleLogout() {
        Cookies.remove("authToken");
        window.location.reload();
    }

    return (
        <div className="hidden lg:flex flex-1 justify-between items-center" >
            <div className="flex gap-x-12">
                {navigationLinks.map((item) => (
                    <Link key={item.name} to={item.href}
                          className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                        {item.name}
                    </Link>
                ))}
                {role === "ROLE_ADMIN" && (
                    <div>
                        <Popover className="relative">
                                <>
                                     <PopoverButton className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                                            <span className="cursor-pointer text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                                              {t("common.admin")}
                                            </span>
                                        <ChevronDownIcon aria-hidden="true" className="size-5" />
                                    </PopoverButton>

                                    <PopoverPanel
                                        style={{zIndex : "9999"}}
                                        className="absolute left-1/2 z-10 mt-2 flex w-screen max-w-max -translate-x-1/2 px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                                    >
                                        <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 ring-1 ring-gray-900/5">
                                            <div className="p-4">
                                                   {routesAdmin.map((item) => (
                                                    <Popover.Button
                                                        key={item.name}
                                                        as={Link}
                                                        to={item.href}
                                                        className="cursor-pointer group relative flex gap-x-6 rounded-lg p-3 hover:bg-gray-50"
                                                    >
                                                        <div className="flex size-5 flex-none items-center justify-center rounded-lg group-hover:bg-white">
                                                            <item.icon aria-hidden="true" className="text-gray-600" />
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-gray-900">{item.name}</span>
                                                        </div>
                                                    </Popover.Button>
                                                ))}
                                            </div>
                                        </div>
                                    </PopoverPanel>
                                </>

                        </Popover>

                    </div>
                )}
                {role === "ROLE_MODERATOR" && (
                    <div>
                        <Popover className="relative">
                            <>
                                <PopoverButton className="inline-flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
                                            <span className="cursor-pointer text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                                              {t("common.admin")}
                                            </span>
                                    <ChevronDownIcon aria-hidden="true" className="size-5" />
                                </PopoverButton>

                                <PopoverPanel
                                    style={{zIndex : "9999"}}
                                    className="absolute left-1/2 z-10 mt-2 flex w-screen max-w-max -translate-x-1/2 px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                                >
                                    <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm/6 ring-1 ring-gray-900/5">
                                        <div className="p-4">
                                            {routesModerator.map((item) => (
                                                <Popover.Button
                                                    key={item.name}
                                                    as={Link}
                                                    to={item.href}
                                                    className="cursor-pointer group relative flex gap-x-6 rounded-lg p-3 hover:bg-gray-50"
                                                >
                                                    <div className="flex size-5 flex-none items-center justify-center rounded-lg group-hover:bg-white">
                                                        <item.icon aria-hidden="true" className="text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-900">{item.name}</span>
                                                    </div>
                                                </Popover.Button>
                                            ))}
                                        </div>
                                    </div>
                                </PopoverPanel>
                            </>

                        </Popover>

                    </div>
                )}


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
                <Languages />
            </div>
        </div>
    );
}
