import { useEffect } from "react";
import { Check, AlertCircle, AlertTriangle, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Toast({ message, type = "success", onClose }) {
    const { t } = useTranslation();
    if (!message) return null;

    const styles = {
        success: {
            icon: <Check size={20} />,
            border: "border-green-500/20",
            iconColor: "text-green-400 bg-green-500/10",
            title: t('toast.success')
        },
        error: {
            icon: <AlertCircle size={20} />,
            border: "border-red-500/20",
            iconColor: "text-red-400 bg-red-500/10",
            title: t('toast.error')
        },
        warning: {
            icon: <AlertTriangle size={20} />,
            border: "border-yellow-500/20",
            iconColor: "text-yellow-400 bg-yellow-500/10",
            title: t('toast.warning')
        }
    };

    const style = styles[type] || styles.success;

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    return (
        <div className={`fixed top-5 right-5 z-50 flex items-center w-full max-w-sm p-4 rounded-lg shadow-xl bg-[#1E293B] border ${style.border} animate-fade-in-down`}>
            <div className={`inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-md ${style.iconColor}`}>
                {style.icon}
            </div>
            <div className="ms-3 text-sm font-normal text-gray-200 flex-1">
                <span className="block font-semibold mb-0.5">{style.title}</span>
                {message}
            </div>

            <button
                onClick={onClose}
                className="ms-auto -mx-1.5 -my-1.5 bg-transparent text-gray-400 hover:text-white rounded-lg p-1.5 hover:bg-white/10 inline-flex items-center justify-center h-8 w-8 transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
}