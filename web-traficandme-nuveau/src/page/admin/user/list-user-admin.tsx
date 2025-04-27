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
    const { users, fetchUsers, deleteDefinitiveUserFoAnAdmin, deleteUserForAnAdmin } = useUserStore();
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
            setIsLoading(true);
            await fetchUsers();
            setIsLoading(false);
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
            if (isPermanentDelete) {
                deleteDefinitiveUserFoAnAdmin(selectedUserId).finally(() => {
                    setIsDeleting(false);
                    setIsConfirmDeleteOpen(false);
                });
            } else {
                deleteUserForAnAdmin(selectedUserId).finally(() => {
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
        <div className="px-4 sm:px-6 lg:px-8 py-4 mt-16 sm:mt-20 max-w-full">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-xl font-semibold text-gray-900">{t("user-admin.title")}</h1>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() => setIsOpenCreate(true)}
                        className="w-full sm:w-auto rounded-md bg-gray-950 px-4 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {t("user-admin.add-user")}
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="search-users"
                        className="block w-full sm:w-80 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t("common.search")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table for larger screens */}
            <div className="hidden md:block overflow-x-auto">
                <div className="inline-block min-w-full py-2 align-middle">
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
                                {t("common.role")}
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                {t("common.status")}
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                {t("common.createDate")}
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
                                    <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-3">
                                        {user.id}
                                    </td>
                                    <td className="py-4 pr-3 pl-4 text-sm font-medium text-gray-900 sm:pl-3">
                                        {user.username}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{user.email}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{user.role}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{user.status}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{user.createDate}</td>
                                    <td className="py-4 pr-4 pl-3 text-right text-sm font-medium">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => handleUpdateClick(user.id)}
                                                className="text-blue-800 hover:text-blue-900 font-medium px-2"
                                            >
                                                {t("common.edit")}
                                            </button>

                                            <button
                                                onClick={() => handleDeleteClick(user.id, false)}
                                                className="text-red-700 hover:text-red-800 font-medium px-2"
                                            >
                                                {t("common.delete")}
                                            </button>

                                            <button
                                                onClick={() => handleDeleteClick(user.id, true)}
                                                className="bg-red-700 hover:bg-red-800 text-white rounded-lg px-3 py-1 text-sm"
                                            >
                                                {t("common.delete-definitive")}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Card view for mobile screens */}
            <div className="md:hidden">
                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <Spinner />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center p-4 text-sm text-gray-500">
                        {searchTerm ? t("user-admin.no_results") : t("user-admin.no_users")}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredUsers.map((user) => (
                            <div key={user.id} className="bg-white border rounded-lg shadow-sm p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className="text-xs font-medium text-gray-500">ID: {user.id}</span>
                                        <h3 className="text-base font-semibold">{user.username}</h3>
                                    </div>
                                    <div className="text-xs text-right">
                                        <div className="font-medium text-gray-500">{t("common.createDate")}:</div>
                                        <div>{user.createDate}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                    <div>
                                        <p className="font-medium text-gray-500">{t("common.email")}:</p>
                                        <p className="truncate">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-500">{t("common.role")}:</p>
                                        <p>{user.role}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-500">{t("common.status")}:</p>
                                        <p>{user.status}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mt-4">
                                    <button
                                        onClick={() => handleUpdateClick(user.id)}
                                        className="flex items-center justify-center text-blue-800 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg py-2 text-sm"
                                    >
                                        {t("common.edit")}
                                    </button>

                                    <button
                                        onClick={() => handleDeleteClick(user.id, false)}
                                        className="flex items-center justify-center text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg py-2 text-sm"
                                    >
                                        {t("common.delete")}
                                    </button>

                                    <button
                                        onClick={() => handleDeleteClick(user.id, true)}
                                        className="flex items-center justify-center text-white bg-red-700 hover:bg-red-800 rounded-lg py-2 text-sm"
                                    >
                                        {t("common.delete-definitive")}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Dialog className="mt-20" open={isOpenCreate} onClose={() => setIsOpenCreate(false)}>
                <CreateUserAdmin setIsOpenCreate={setIsOpenCreate} />
            </Dialog>

            <Dialog open={isOpenUpdate} onClose={() => setIsOpenUpdate(false)}>
                {selectedUserId && <UpdateUserAdmin id={selectedUserId} setIsOpenUpdate={setIsOpenUpdate} />}
            </Dialog>

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