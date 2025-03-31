import {useEffect, useState} from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Languages from "../languages/languages.tsx";
import {Dialog} from "../../assets/kit-ui/dialog.tsx";
import Login from "../../connexion/login/login.tsx";
import Register from "../../connexion/register/register.tsx";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {getUserRole} from "../../services/service/token-service.tsx";
import Cookies from "js-cookie";

export interface interfaceLanguages {
    name: string
    img : string
}

type NavigationItem = {
    name: string;
    href: string;
};

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isOpenLogin, setIsOpenLogin] = useState(false);
    const [isOpenRegister, setIsOpenRegister] = useState(false);
    const { t } = useTranslation();
    const [role, setRole] = useState<string | string[] | null>(null);
    const token = Cookies.get("authToken");
    const navigation : NavigationItem[] = [
        { name: t('header.home'), href: '/' },
        { name: t('header.map'), href: '/map' },
        { name: t('header.company'), href: '/about' },
    ];

    const navigationAdmin: NavigationItem[] = [
        { name: t('header.home'), href: '/'},
        { name: t('header.map'), href: '/map' },
        { name: t('header.company'), href: '/about'},
        { name: t('header.users'), href: '/admin/management-users'}
    ];

    const languages : interfaceLanguages[] = [
        { name: 'en', img: 'images/languages/english.png' },
        { name: 'fr', img: 'images/languages/french.png' },
    ];

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    function handleLogout() {
        Cookies.remove("authToken");
        // TODO refresh obbligatoire
    }

    const navigationLinks = role !== "ROLE_ADMIN" ? navigationAdmin : navigation;

    useEffect(() => {
        setRole(getUserRole());
    }, [token]);

    return (
        <header className="bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
                <div className="flex flex-1">
                    <div className="hidden lg:flex lg:gap-x-12">
                        {navigationLinks.map((item) => (
                            <Link key={item.name} to={item.href}
                                  className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="size-6" />
                        </button>
                    </div>
                </div>

                <a href="#" className="-m-1.5">
                    <span className="sr-only">Company</span>
                    <img
                        className="h-12 w-auto"
                        src="/images/logo/logo_2.png"
                        alt="Logo"
                        height="800"
                        width="800"
                    />
                </a>

                <div className="flex flex-1 justify-end">
                    {role ? (
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton
                                    className="relative flex rounded-full bg-gray-800 text-sm focus:ring-offset-2 focus:ring-offset-gray-800">
                                    <span className="absolute -inset-1.5"/>
                                    <img alt="Profile" src="/image/user1.png" className="h-8 w-8 rounded-full"/>
                                </MenuButton>
                            </div>
                            <MenuItems
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                <MenuItem>
                                    {({active}) => (
                                        <Link to="/profile" className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}>
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
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                            <button className="cursor-pointer text-sm font-semibold text-gray-900" onClick={() => setIsOpenRegister(true)}>
                                {t("header.register")}
                            </button>
                            <button className="cursor-pointer ml-5 text-sm font-semibold text-gray-900" onClick={() => setIsOpenLogin(true)}>
                                {t("header.login")} <span aria-hidden="true">&rarr;</span>
                            </button>
                        </div>
                    )}
                    <Languages languages={languages} />

                </div>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-10">
                    <div className="fixed inset-0 z-10 bg-black/50" onClick={toggleMobileMenu}></div>
                    <div className="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-white px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-1">
                                <button
                                    type="button"
                                    onClick={toggleMobileMenu}
                                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon className="size-6" />
                                </button>
                            </div>
                            <a href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">Company</span>
                                <img className="h-8 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Logo" />
                            </a>
                        </div>
                        <div className="mt-6 space-y-2">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <Dialog style={{zIndex: 11, position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center", alignItems: "center"}} open={isOpenLogin} onClose={() => setIsOpenLogin(false)}>
                <Login closeModal={() => setIsOpenLogin(false)} />
            </Dialog>
            <Dialog  style={{zIndex: 11, position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center", alignItems: "center"}} open={isOpenRegister} onClose={() => setIsOpenRegister(false)}>
                <Register closeModal={() => setIsOpenRegister(false)} />
            </Dialog>
        </header>
    );
}
