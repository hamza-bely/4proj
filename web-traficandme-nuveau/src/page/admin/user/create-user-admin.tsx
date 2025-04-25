import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // ← nouveau
import useUserStore from "../../../services/store/user-store.tsx";
import { UserCreateRequest } from "../../../services/model/user.tsx";

export default function CreateUserAdmin({ setIsOpenCreate }: { setIsOpenCreate: (open: boolean) => void }) {
    const { t } = useTranslation(); // ← hook de traduction
    const { createUser } = useUserStore();

    const defaultUserData: UserCreateRequest = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "USER",
    };

    const [request, setRequest] = useState<UserCreateRequest>(defaultUserData);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRequest((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await createUser(request);
            setIsOpenCreate(false);
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur", error);
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = Object.values(request).every((value) => value !== "");

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg p-5">
            <h2 className="text-2xl font-semibold text-gray-900 text-center">
                {t("createUser.title")}
            </h2>
            <div className="space-y-4">
                <div>
                    <label className="block font-medium text-gray-700">{t("createUser.firstName")}</label>
                    <input
                        type="text"
                        name="firstName"
                        value={request.firstName}
                        onChange={handleChange}
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700">{t("createUser.lastName")}</label>
                    <input
                        type="text"
                        name="lastName"
                        value={request.lastName}
                        onChange={handleChange}
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700">{t("createUser.email")}</label>
                    <input
                        type="email"
                        name="email"
                        value={request.email}
                        onChange={handleChange}
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700">{t("createUser.password")}</label>
                    <input
                        type="password"
                        name="password"
                        value={request.password}
                        onChange={handleChange}
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700">{t("createUser.role")}</label>
                    <select
                        name="role"
                        value={request.role}
                        onChange={handleChange}
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"
                    >
                        <option value="USER">{t("createUser.user")}</option>
                        <option value="ADMIN">{t("createUser.admin")}</option>
                        <option value="MODERATOR">{t("createUser.moderator")}</option>
                    </select>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || isLoading}
                    className={`w-full p-2 rounded ${isFormValid && !isLoading ? "bg-gray-950 text-white hover:bg-gray-800" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                >
                    {isLoading ? (
                        <div className="flex justify-center items-center">
                            <span className="ml-2">{t("createUser.loading")}</span>
                        </div>
                    ) : (
                        t("createUser.submit")
                    )}
                </button>
            </div>
        </div>
    );
}
