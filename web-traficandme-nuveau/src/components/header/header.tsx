import { useEffect, useState } from "react";
import { Dialog } from "../../assets/kit-ui/dialog.tsx";
import Login from "../../connexion/login/login.tsx";
import Register from "../../connexion/register/register.tsx";
import { useTranslation } from "react-i18next";
import { getUserRole } from "../../services/service/token-service.tsx";
import Cookies from "js-cookie";
import useUserStore from "../../services/store/user-store.tsx";
import MobileHeader from "./mobile-header.tsx";
import DesktopHeader from "./dekstop-header.tsx";

export default function Header() {
    const [isOpenLogin, setIsOpenLogin] = useState(false);
    const [isOpenRegister, setIsOpenRegister] = useState(false);
    const { t } = useTranslation();
    const [role, setRole] = useState<string | string[] | null>(null);
    const token = Cookies.get("authToken");
    const { fetchUser } = useUserStore();
    const navigation = [
        { name: t("header.home"), href: "/" },
        { name: t("header.map"), href: "/map" },
    ];

    useEffect(() => {
        setRole(getUserRole());
        if (token) fetchUser().catch(console.error);
    }, [token]);

    return (
        <header className="bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
                <MobileHeader
                    role={role}
                    navigationLinks={navigation}
                    openLogin={() => setIsOpenLogin(true)}
                    openRegister={() => setIsOpenRegister(true)}
                />

                <DesktopHeader
                    role={role}
                    navigationLinks={navigation}
                    openLogin={() => setIsOpenLogin(true)}
                    openRegister={() => setIsOpenRegister(true)}
                />
            </nav>

            <Dialog open={isOpenLogin} onClose={() => setIsOpenLogin(false)}>
                <Login closeModal={() => setIsOpenLogin(false)} />
            </Dialog>
            <Dialog open={isOpenRegister} onClose={() => setIsOpenRegister(false)}>
                <Register closeModal={() => setIsOpenRegister(false)} />
            </Dialog>
        </header>
    );
}
