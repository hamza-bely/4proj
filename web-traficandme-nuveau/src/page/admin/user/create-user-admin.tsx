import React, { useState } from "react";
import useUserStore from "../../../services/store/user-store.tsx";
import {UserCreateRequest} from "../../../services/model/user.tsx";

export default function CreateUserAdmin({ setIsOpenCreate }: { setIsOpenCreate: (open: boolean) => void }) {
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
                Ajouter un utilisateru
            </h2>
            <div className="space-y-4">
                <div>
                <label className="block font-medium text-gray-700">Prénom</label>
                    <input
                        type="text"
                        name="firstName"
                        value={request.firstName}
                        onChange={handleChange}
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700">Nom</label>
                    <input
                        type="text"
                        name="lastName"
                        value={request.lastName}
                        onChange={handleChange}
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={request.email}
                        onChange={handleChange}
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700">Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        value={request.password}
                        onChange={handleChange}
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700">Rôle</label>
                    <select
                        name="role"
                        value={request.role}
                        onChange={handleChange}
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"
                    >
                        <option value="USER">Utilisateur</option>
                        <option value="ADMIN">Administrateur</option>
                    </select>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid || isLoading}
                    className={`w-full p-2 rounded ${isFormValid && !isLoading ? "bg-gray-950 text-white hover:bg-gray-800" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                >
                    {isLoading ? (
                        <div className="flex justify-center items-center">
                            <span className="ml-2">Chargement...</span>
                        </div>
                    ) : (
                        "Ajouter l'utilisateur"
                    )}
                </button>
            </div>
        </div>
    );
}
