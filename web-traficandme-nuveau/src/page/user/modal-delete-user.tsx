import { useState } from "react";
import { useTranslation } from "react-i18next";
import useUserStore from "../../services/store/user-store.tsx";
import Cookies from "js-cookie";

interface ModalDeleteUserProps {
    closeModal: () => void;
    userId: number | undefined;
}

export default function ModalDeleteUser({ closeModal, userId }: ModalDeleteUserProps) {
    const { t } = useTranslation(); // Hook pour les traductions
    const [inputValue, setInputValue] = useState("");
    const {  deleteUserForAnUser } = useUserStore();
    const isConfirmed = inputValue.trim().toUpperCase() === "CONFIRME";
    //const  [isLoading,setIsLoading] = useState<boolean>(false)

    const HandleDeleteUser =  async () => {
           console.log(userId)
            try{
                await deleteUserForAnUser(userId)
                Cookies.remove("authToken");
                window.location.reload();
            }catch(err) {
               console.log(err)
            }
    }

    return (
        <div className="bg-white  sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900">{t("profile.modal.title")}</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>{t("profile.modal.description")}</p>
                </div>
                <form className="mt-5">
                    <input
                        type="text"
                        placeholder={t("profile.modal.placeholder")}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-red-500 focus:ring-red-500 sm:text-sm"
                    />
                    <div className="mt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
                        >
                            {t("profile.modal.cancel")}
                        </button>
                        <button
                            type="button"
                            onClick={HandleDeleteUser}
                            disabled={!isConfirmed}
                            className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
                                isConfirmed ? "bg-red-600 hover:bg-red-500" : "bg-gray-400 cursor-not-allowed"
                            }`}
                        >
                            {t("profile.modal.confirm")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
