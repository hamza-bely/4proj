import { useEffect, useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/sniper/sniper.tsx";
import useUserStore from "../../services/store/user-store.tsx";
import {Dialog} from "../../assets/kit-ui/dialog.tsx";
import ModalDeleteUser from "./modal-delete-user.tsx";
import ReportsUser from "./reports-user.tsx";
import {MdReportProblem} from "react-icons/md";
import RoutesUser from "./routes-user.tsx";
import {FaRoute} from "react-icons/fa";

const secondaryNavigation = [
    { name: "General", href: "#", icon: UserCircleIcon },
    { name: "Reports", href: "#", icon: MdReportProblem  },
    { name: "Routes", href: "#", icon: FaRoute   },
];

export default function ProfileUser() {
    const { t } = useTranslation();
    const { user, fetchUser } = useUserStore();
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentNavigation, setCurrentNavigation] = useState("General");
    const [formData, setFormData] = useState({
        name: user?.username || "",
        email: user?.email || "",
        password: "",
    });
    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchUser();
                setIsUserLoading(false);
            } catch (error) {
                console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
            }
        };
        fetchData();
    }, [fetchUser]);


    const handleNavigationClick = (name: string) => {
        setCurrentNavigation(name);
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            //await updateUser(formData); //TODO A FAIRE
            setEditMode(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
        }
    };

    return (
        <div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
            <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
                <nav className="flex-none px-4 sm:px-6 lg:px-0">
                    <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                        {secondaryNavigation.map((item) => (
                            <li key={item.name}>
                                <a
                                    href={item.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavigationClick(item.name);
                                    }}
                                    className={`group flex gap-x-3 rounded-md py-2 pr-3 pl-2 text-sm font-semibold ${currentNavigation === item.name ? "bg-gray-200 text-gray-950" : "text-gray-800 hover:bg-gray-950 hover:text-white"}`}
                                >
                                    <item.icon
                                        className={`size-6 shrink-0 ${currentNavigation === item.name ? "text-gray-950" : "text-gray-400 group-hover:text-white"}`}
                                    />
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
                <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
                    {currentNavigation === "General" && (
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">Profile</h2>

                            {isUserLoading ? (
                                <div className="mt-4 text-center">
                                    <Spinner />
                                </div>
                            ) : user ? (
                                <div className="mt-6 space-y-4">
                                    {!editMode ? (
                                        <dl className="border-t border-gray-200 divide-y divide-gray-100 text-sm">
                                            <div className="flex justify-between py-3">
                                                <dt className="text-gray-500">{t("profile.name")}</dt>
                                                <dd className="text-gray-900">{user.username}</dd>
                                            </div>
                                            <div className="flex justify-between py-3">
                                                <dt className="text-gray-500">{t("common.email")}</dt>
                                                <dd className="text-gray-900">{user.email}</dd>
                                            </div>
                                            <div className="flex justify-between py-3">
                                                <dt className="text-gray-500">{t("profile.date-create-profile")}</dt>
                                                <dd className="text-gray-900">{new Date(user.createDate).toLocaleDateString()}</dd>
                                            </div>
                                        </dl>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">{t("profile.name")}</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full p-2 mt-1 border rounded-md"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">{t("common.email")}</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full p-2 mt-1 border rounded-md"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">{t("profile.password")}</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="w-full p-2 mt-1 border rounded-md"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6 flex gap-x-4">
                                        {editMode ? (
                                            <>
                                                <button
                                                    onClick={handleSubmit}
                                                    className="px-4 py-2 text-white bg-gray-950 rounded-md hover:bg-gray-800"
                                                >
                                                    {t("profile.save")}
                                                </button>
                                                <button
                                                    onClick={() => setEditMode(false)}
                                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                                >
                                                    {t("profile.cancel")}
                                                </button>
                                            </>
                                        ) : (
                                            <div>

                                                <button
                                                    onClick={() => setEditMode(true)}
                                                    className="px-4 py-2 text-white bg-gray-950 rounded-md hover:bg-gray-800 hover:text-white"
                                                >
                                                    {t("profile.edit")}
                                                </button>

                                                <button
                                                    onClick={() =>   setIsOpen(true)}
                                                    className="px-4 ml-5 py-2 text-white bg-red-700 rounded-md hover:bg-red-600 hover:text-white"
                                                >
                                                    {t("profile.delete")}
                                                </button>
                                            </div>

                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500"> {t("profile.no_user_info")}</p>
                            )}
                        </div>
                    )}

                    {currentNavigation === "Reports" && (
                        <ReportsUser/>
                    )}

                    {currentNavigation === "Routes" && (
                        <RoutesUser/>
                    )}
                </div>
                <Dialog style={{ zIndex: 11, position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center", alignItems: "center" }} open={isOpen} onClose={() => setIsOpen(false)}>
                    <ModalDeleteUser closeModal={() => setIsOpen(false)}  userId={user?.id} />
                </Dialog>
            </main>
        </div>
    );
}
