import { useTranslation } from "react-i18next";
import {Dialog} from "../../assets/kit-ui/dialog";

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
                                          open,
                                          title,
                                          confirmText,
                                          cancelText,
                                          loading,
                                          onConfirm,
                                          onCancel,
                                      }: ConfirmDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onClose={onCancel}>
            <div className="p-6 max-w-md bg-white rounded-lg ">
                <h2 className="text-lg font-semibold mb-4">{title ?? t("common.message-confirm-delete")}</h2>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        {cancelText ?? t("cancel")}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        {loading ? t("loading") : confirmText ?? t("confirm")}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
