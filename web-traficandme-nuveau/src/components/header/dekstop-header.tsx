import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import useUserStore from "../../services/store/user-store.tsx";
import Languages from "../languages/languages.tsx";

interface DesktopHeaderProps {
    role: string | string[] | null;
    navigationLinks: { name: string; href: string }[];
    openLogin: () => void;
    openRegister: () => void;
}

export default function DesktopHeader({ role, navigationLinks, openLogin, openRegister }: DesktopHeaderProps) {
    const { t } = useTranslation();
    const { user } = useUserStore();

    const languages: any[] = [
        { name: 'en', img: 'images/languages/english.png' },
        { name: 'fr', img: 'images/languages/french.png' },
        ]

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
            </div>
            <a href="#" className="-m-1.5">
                <img className="h-12 w-auto" src="/images/logo/logo_2.png" alt="Logo"/>
            </a>

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
                <Languages languages={languages}/>
            </div>
        </div>
    );
}
