import { useTranslation } from "react-i18next";
import useUserStore from "../../../services/store/user-store";
import { useEffect, useState } from "react";
import UpdateUserAdmin from "./update-user-admin.tsx";
import CreateUserAdmin from "./create-user-admin.tsx";
import Spinner from "../../../components/sniper/sniper.tsx";
import { Dialog } from "../../../assets/kit-ui/dialog";
import { ToastContainer } from "react-toastify";
import ConfirmDialog from "../../../components/dialog/dialog.tsx";

export default function ListUserAdmin() {
    const { t } = useTranslation();
    const { users, fetchUsers,deleteDefinitiveUserFoAnAdmin,deleteUserForAnAdmin } = useUserStore();
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [isOpenUpdate, setIsOpenUpdate] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isPermanentDelete, setIsPermanentDelete] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchUsers();
                setIsLoading(false);
            } catch (error) {
                console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
            }
        };
        fetchData();
    }, [fetchUsers]);

    const handleUpdateClick = (id: number) => {
        setSelectedUserId(id);
        setIsOpenUpdate(true);
    };

    const handleDeleteClick = (userId: number, permanent: boolean = false) => {
        setSelectedUserId(userId);
        setIsPermanentDelete(permanent);
        setIsConfirmDeleteOpen(true);
    };

    const confirmDelete = () => {
        if (selectedUserId !== null) {
            setIsDeleting(true);
            if(isPermanentDelete){
                deleteDefinitiveUserFoAnAdmin(selectedUserId,).finally(() => {
                    setIsDeleting(false);
                    setIsConfirmDeleteOpen(false);
                });
            }else{
                deleteUserForAnAdmin(selectedUserId,).finally(() => {
                    setIsDeleting(false);
                    setIsConfirmDeleteOpen(false);
                });
            }

        }
    };

    const filteredUsers = users.filter((user) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            user.id.toString().includes(searchTermLower) ||
            user.username.toLowerCase().includes(searchTermLower) ||
            user.email.toLowerCase().includes(searchTermLower) ||
            user.role.toLowerCase().includes(searchTermLower) ||
            user.status.toLowerCase().includes(searchTermLower)
        );
    });

    return (
        <div className="px-4 sm:px-6 lg:px-8 mt-20">
            <ToastContainer
                style={{ zIndex: 9999 }}
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">{t("user-admin.title")}</h1>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        onClick={() => setIsOpenCreate(true)}
                        className="block rounded-md bg-gray-950 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {t("user-admin.add-user")}
                    </button>
                </div>
            </div>

            <div className="mt-4 mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="search-users"
                        className="block w-80 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("common.search")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-8">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full  py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                            <tr>
                                <th scope="col"
                                    className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                    {t("id")}
                                </th>
                                <th scope="col"
                                    className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                                    {t("user-admin.username")}
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    {t("common.email")}
                                </th>

                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    {t("user-admin.role")}
                                </th>

                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    {t("user-admin.status")}
                                </th>

                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    {t("user-admin.createDate")}
                                </th>

                                <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-3">
                                    <span className="sr-only">{t("user-admin.actions")}</span>
                                </th>

                            </tr>
                            </thead>
                            <tbody className="bg-white">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="py-4 text-center text-sm text-gray-500">
                                        <Spinner />
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-4 text-center text-sm text-gray-500">
                                        {searchTerm ? t("user-admin.no_results") : t("user-admin.no_users")}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="even:bg-gray-50">
                                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-3">
                                            {user.id}
                                        </td>
                                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-3">
                                            {user.username}
                                        </td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{user.email}</td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{user.role}</td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{user.status}</td>
                                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">{user.createDate}</td>
                                        <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3">
                                            <div className="relative inline-block text-left">
                                                    <div  className="py-1 flex">
                                                                <button
                                                                    onClick={() => handleUpdateClick(user.id)}
                                                                    className={`cursor-pointer text-blue-800 block w-full px-4 py-2 text-left text-sm`}
                                                                >
                                                                    {t("common.edit")}
                                                                </button>

                                                                <button
                                                                    onClick={() => handleDeleteClick(user.id, false)}
                                                                    className={`cursor-pointer text-red-700 block w-full px-4 py-2 text-left text-sm`}
                                                                >
                                                                    {t("common.delete")}
                                                                </button>

                                                                <button
                                                                    onClick={() => handleDeleteClick(user.id, true)}
                                                                    className={`cursor-pointer rounder rounded-lg block bg-red-700 w-full px-4 py-2 text-left text-white text-sm`}
                                                                >
                                                                    {t("common.delete-definitive")}
                                                                </button>
                                                    </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Dialog className="mt-20" open={isOpenCreate} onClose={() => setIsOpenCreate(false)}>
                <CreateUserAdmin setIsOpenCreate={setIsOpenCreate} />
            </Dialog>

            <Dialog open={isOpenUpdate} onClose={() => setIsOpenUpdate(false)}>
                {selectedUserId && <UpdateUserAdmin id={selectedUserId} setIsOpenUpdate={setIsOpenUpdate} />}
            </Dialog>

            {/* Confirmation Dialog for Delete */}
            <ConfirmDialog
                open={isConfirmDeleteOpen}
                cancelText={t("cancel")}
                loading={isDeleting}
                onConfirm={confirmDelete}
                onCancel={() => setIsConfirmDeleteOpen(false)}
            />
        </div>
    );
}