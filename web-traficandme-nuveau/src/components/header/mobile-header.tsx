import { useState } from "react";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import useUserStore from "../../services/store/user-store.tsx";
import Languages from "../languages/languages.tsx";
import {routesAdmin, routesModerator} from "./navigation.tsx";

interface MobileHeaderProps {
    navigationLinks: { name: string; href: string }[];
    role: string | string[] | null;
    openLogin: () => void;
    openRegister: () => void;
}

export default function MobileHeader({ navigationLinks, role, openLogin, openRegister }: MobileHeaderProps) {
    const { t } = useTranslation();
    const { user } = useUserStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);

    function handleLogout() {
        Cookies.remove("authToken");
        window.location.reload();
    }

    const getInitials = (username: string) => {
        return username ? username.charAt(0).toUpperCase() : "";
    };

    return (
        <div className="lg:hidden">
            <button
                type="button"
                onClick={toggleMobileMenu}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                aria-label="Open menu"
            >
                <Bars3Icon className="size-6"/>
            </button>

            {mobileMenuOpen && (
                <div className="fixed inset-0 z-99999">
                    <div className="fixed inset-0 bg-black/50" onClick={toggleMobileMenu}></div>
                    <div className="fixed inset-y-0 left-0 w-full max-w-sm overflow-y-auto bg-white px-6 py-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <a href="#" className="-m-1.5">
                                <img className="h-8 w-auto" src="/images/logo/logo_2.png" alt="Logo"/>
                            </a>
                            <button
                                type="button"
                                onClick={toggleMobileMenu}
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                aria-label="Close menu"
                            >
                                <XMarkIcon className="size-6"/>
                            </button>
                        </div>

                        {role ? (
                            <div className="mt-6 border-t border-gray-200 pt-4">
                                <div className="flex items-center space-x-3 py-3">
                                    <span className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-medium">
                                        {getInitials(user?.username || "")}
                                    </span>
                                    <div>
                                        <p className="text-base font-medium text-gray-900">{user?.username}</p>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 py-2">
                                    <Link
                                        to="/profile"
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                                        onClick={toggleMobileMenu}
                                    >
                                        {t("profile.title")}
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            toggleMobileMenu();
                                        }}
                                        className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                                    >
                                        {t("logout")}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 border-t border-gray-200 pt-4">
                                <div className="flex flex-col space-y-3">
                                    <button
                                        onClick={() => {
                                            openRegister();
                                            toggleMobileMenu();
                                        }}
                                        className="w-full rounded-md bg-gray-100 px-3 py-2 text-center text-base font-medium text-gray-900 hover:bg-gray-200"
                                    >
                                        {t("header.register")}
                                    </button>
                                    <button
                                        onClick={() => {
                                            openLogin();
                                            toggleMobileMenu();
                                        }}
                                        className="w-full rounded-md bg-blue-600 px-3 py-2 text-center text-base font-medium text-white hover:bg-blue-700"
                                    >
                                        {t("header.login")}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Navigation links */}
                        <div className="mt-6 border-t border-gray-200 pt-4">
                            <div className="space-y-2">
                                {navigationLinks.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={toggleMobileMenu}
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                {role === "ROLE_ADMIN" && (
                                    <div className="mt-2">
                                        <button
                                            onClick={toggleAdminMenu}
                                            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                                        >
                                            {t('admin')}
                                            <ChevronDownIcon
                                                className={`size-5 text-gray-500 transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`}
                                                aria-hidden="true"
                                            />
                                        </button>

                                        {adminMenuOpen && (
                                            <div className="ml-4 space-y-1 mt-2 border-l-2 border-gray-100 pl-2">
                                                {routesAdmin.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        to={item.href}
                                                        onClick={toggleMobileMenu}
                                                        className="flex items-center space-x-3 rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                                                    >
                                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-600">
                                                            <item.icon className="size-4" aria-hidden="true" />
                                                        </span>
                                                        <span>{item.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {role === "ROLE_MODERATOR" && (
                                    <div className="mt-2">
                                        <button
                                            onClick={toggleAdminMenu}
                                            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                                        >
                                            {t('admin')}
                                            <ChevronDownIcon
                                                className={`size-5 text-gray-500 transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`}
                                                aria-hidden="true"
                                            />
                                        </button>

                                        {adminMenuOpen && (
                                            <div className="ml-4 space-y-1 mt-2 border-l-2 border-gray-100 pl-2">
                                                {routesModerator.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        to={item.href}
                                                        onClick={toggleMobileMenu}
                                                        className="flex items-center space-x-3 rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                                                    >
                                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-600">
                                                            <item.icon className="size-4" aria-hidden="true" />
                                                        </span>
                                                        <span>{item.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 border-t border-gray-200 pt-4">
                            <div className="px-3 py-2">
                                <p className="text-base font-medium text-gray-900 mb-2">{t('language')}</p>
                                <div className="flex space-x-2">
                                    <Languages />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}