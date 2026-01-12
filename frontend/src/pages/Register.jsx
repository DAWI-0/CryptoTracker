import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useTranslation } from "react-i18next";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function Register() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || t('register.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      
      <div className="w-full max-w-md bg-[#0F172A] border-2 border-[#E6D8B5] rounded-xl shadow-[10px_-10px_0px_0px_#000000] overflow-hidden">
        
        <div className="p-8 pb-6 text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
            {t('register.title')}
          </h2>
          <p className="text-sm text-slate-400">
            Créez votre compte pour commencer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-5">
          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg border border-red-500/50 flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Nom d'utilisateur
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-500 group-focus-within:text-[#E6D8B5] transition-colors" />
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2.5 bg-[#1E293B] border border-slate-700 text-white rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E6D8B5] focus:border-transparent transition-all duration-200 sm:text-sm"
                placeholder={t('register.username_placeholder')}
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-[#E6D8B5] transition-colors" />
              </div>
              <input
                type="email"
                className="block w-full pl-10 pr-3 py-2.5 bg-[#1E293B] border border-slate-700 text-white rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E6D8B5] focus:border-transparent transition-all duration-200 sm:text-sm"
                placeholder={t('register.email_placeholder')}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Mot de passe
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-[#E6D8B5] transition-colors" />
              </div>
              <input
                type="password"
                className="block w-full pl-10 pr-3 py-2.5 bg-[#1E293B] border border-slate-700 text-white rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E6D8B5] focus:border-transparent transition-all duration-200 sm:text-sm"
                placeholder={t('register.password_placeholder')}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-slate-900 bg-[#E6D8B5] hover:bg-[#d1c29e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F172A] focus:ring-[#E6D8B5] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6 active:translate-y-1"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                {t('register.button')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </form>
        
        <div className="px-8 py-4 bg-[#1E293B]/50 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-medium text-[#E6D8B5] hover:text-[#d1c29e] hover:underline transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}