import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

export default function Navbar({ user }) {
  const { t, i18n } = useTranslation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
    window.location.href = "/";
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  const flags = {
    fr: { src: "https://flagcdn.com/fr.svg", alt: "Français" },
    en: { src: "https://flagcdn.com/us.svg", alt: "English" },
    ar: { src: "https://flagcdn.com/ma.svg", alt: "العربية" }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A] shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1" />

          <div className="flex items-center gap-8">
            <NavLink to="/">{t('nav.home')}</NavLink>
            {user ? (
              <>
                <NavLink to="/transactions">{t('nav.transactions')}</NavLink>
                <NavLink to="/trade">{t('nav.trade')}</NavLink>
                {user.role === "admin" && (
                  <NavLink to="/dashboard">{t('nav.dashboard')}</NavLink>
                )}
              </>
            ) : (
              <>
                <NavLink to="/login">{t('nav.login')}</NavLink>
                <NavLink to="/register">{t('nav.register')}</NavLink>
              </>
            )}
          </div>

          <div className="flex-1 flex justify-end items-center gap-6">

            <div className="relative">
              <button
                onClick={() => { setLangOpen(!langOpen); setProfileOpen(false); }}
                className="flex items-center gap-2 p-1 rounded-md hover:bg-[#E6D8B5]/10 transition-colors"
              >
                <img
                  src={flags[i18n.language]?.src || flags.fr.src}
                  alt="Current Language"
                  className="w-6 h-4 object-cover rounded-sm shadow-sm"
                />
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-3 w-16 bg-[#1E293B] border border-[#E6D8B5]/40 rounded-lg shadow-xl py-2 animate-fade-in z-50 flex flex-col items-center gap-2">

                  <button
                    onClick={() => changeLanguage('fr')}
                    className={`p-1.5 rounded-md transition-all ${i18n.language === 'fr' ? 'bg-[#E6D8B5]/20 ring-1 ring-[#E6D8B5]' : 'hover:bg-white/10'}`}
                    title="Français"
                  >
                    <img src={flags.fr.src} alt="FR" className="w-6 h-4 object-cover rounded-sm" />
                  </button>

                  <button
                    onClick={() => changeLanguage('en')}
                    className={`p-1.5 rounded-md transition-all ${i18n.language === 'en' ? 'bg-[#E6D8B5]/20 ring-1 ring-[#E6D8B5]' : 'hover:bg-white/10'}`}
                    title="English"
                  >
                    <img src={flags.en.src} alt="EN" className="w-6 h-4 object-cover rounded-sm" />
                  </button>

                  <button
                    onClick={() => changeLanguage('ar')}
                    className={`p-1.5 rounded-md transition-all ${i18n.language === 'ar' ? 'bg-[#E6D8B5]/20 ring-1 ring-[#E6D8B5]' : 'hover:bg-white/10'}`}
                    title="العربية"
                  >
                    <img src={flags.ar.src} alt="AR" className="w-6 h-4 object-cover rounded-sm" />
                  </button>

                </div>
              )}
            </div>

            {user && (
              <div className="relative">
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setLangOpen(false); }}
                  className="focus:outline-none"
                >
                  <img
                    src={(user.profile ? `http://localhost:5000${user.profile}` : `https://ui-avatars.com/api/?name=${user.username}&background=E6D8B5&color=0F172A`)}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full ring-2 ring-[#E6D8B5] hover:ring-white transition-all"
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-40 bg-[#1E293B] border border-[#E6D8B5]/40 rounded-lg shadow-xl py-2 animate-fade-in z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-white hover:bg-[#E6D8B5]/10 transition-colors"
                      onClick={() => setProfileOpen(false)}
                    >
                      {t('nav.profile')}
                    </Link>
                    <button
                      onClick={() => { setProfileOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2 text-white hover:bg-[#E6D8B5]/10 transition-colors"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="relative text-white hover:text-[#E6D8B5] transition-colors duration-300 group">
      {children}
      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#E6D8B5] group-hover:w-full transition-all duration-300" />
    </Link>
  );
}