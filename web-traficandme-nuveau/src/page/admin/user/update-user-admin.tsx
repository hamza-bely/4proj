import { useEffect, useState } from "react";
import useUserStore from "../../../services/store/user-store";
import Spinner from "../../../components/sniper/sniper.tsx";
import {UserUpdaterRequest} from "../../../services/model/user.tsx";

export default function UpdateUserAdmin({
                                            id,
                                            setIsOpenUpdate,
                                        }: {
    id: number;
    setIsOpenUpdate: (open: boolean) => void;
}) {
    const { updateUserByAdmin, users } = useUserStore();
    const [userData, setUserData] = useState<UserUpdaterRequest>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "ROLE_USER",
        status : ""
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const selectedUser = users.find((user ) => user.id === id);
        if (selectedUser) {
            setUserData({
                firstName: selectedUser.username?.split(" ")[0] || "",
                lastName: selectedUser.username?.split(" ")[1] || "",
                email: selectedUser.email || "",
                password: "",
                role: selectedUser.role || "ROLE_USER",
                status : selectedUser.status
            });
        }
    }, [id, users]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const updatePayload = { ...userData };

            await updateUserByAdmin(id, updatePayload);
            setIsOpenUpdate(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg p-5">
            <h2 className="text-2xl font-semibold text-gray-900 text-center">
                Modifier un Utilisateur
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-gray-700 font-medium">Prénom</label>
                    <input
                        type="text"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                        required
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Nom</label>
                    <input
                        type="text"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                        required
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        placeholder="Laisser vide si non modifié"
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder-gray-400 focus:outline-indigo-600"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Rôle</label>
                    <select
                        name="role"
                        value={userData.role}
                        onChange={handleChange}
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
                    >
                        <option value="USER">Utilisateur</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Status</label>
                    <select
                        name="status"
                        value={userData.status}
                        onChange={handleChange}
                        className="m-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                        <option value="DELETED">DELETED</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 rounded-lg font-semibold transition duration-200 ${
                        isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gray-950 text-white hover:bg-gray-800"
                    }`}
                >
                    {isLoading ? <Spinner/> : "Mettre à jour l'utilisateur"}
                </button>
            </form>
        </div>
    );
}
