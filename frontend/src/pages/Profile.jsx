import { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import api from "../api/axios";

const socialPlatforms = [
  { key: "facebook", icon: FaFacebook, base: "https://facebook.com" },
  { key: "instagram", icon: FaInstagram, base: "https://instagram.com" },
  { key: "twitter", icon: FaTwitter, base: "https://twitter.com" },
  { key: "linkedin", icon: FaLinkedin, base: "https://linkedin.com/in" },
];

import { useTranslation } from "react-i18next";

export default function Profile() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [edit, setEdit] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    api.get("/user/me")
      .then(res => {
        const filled = socialPlatforms.reduce((acc, p) => ({ ...acc, [p.key]: res.data.user[p.key] || "" }), {});
        setUser({ ...res.data.user, ...filled });
        setLoading(false);
      })
      .catch(() => {
        setMessage(t('profile.update_error'));
        setLoading(false);
      });
  }, []);

  const updateProfile = async () => {
    try {
      await api.put("/user/me", user);
      setMessage(t('profile.update_success'));
      setEdit(false);
    } catch {
      setMessage(t('profile.update_error'));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    uploadAvatar(file);
  };

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await api.post("/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUser({ ...user, profile: res.data.profile });
      setMessage(t('profile.avatar_success'));
    } catch {
      setMessage(t('profile.avatar_error'));
    }
  };

  if (loading) return <p className="text-center mt-10 text-[#E6D8B5]">{t('profile.loading')}</p>;
  if (!user) return <p className="text-center mt-10 text-[#FFFFFF]">{message}</p>;

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#FFFFFF] pt-20 px-6">
      <div className="max-w-3xl mx-auto space-y-8">

        <h1 className="text-4xl font-extrabold text-center text-[#E6D8B5]">{t('profile.title')}</h1>

        <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#E6D8B5]/30">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={preview || (user.profile ? `http://localhost:5000${user.profile}` : `https://ui-avatars.com/api/?name=${user.username}&background=E6D8B5&color=0F172A`)}
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover ring-4 ring-[#E6D8B5]"
              />
              <label className="absolute bottom-0 right-0 bg-[#E6D8B5] text-[#0F172A] px-3 py-1 rounded-full cursor-pointer hover:bg-[#FFFFFF] transition">
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                {t('profile.edit_photo')}
              </label>
            </div>

            <div className="flex-1 text-center md:text-left">
              <p className="text-2xl font-bold">@{user.username}</p>
              <p className="text-sm text-gray-400 mt-1">{t('profile.created_at')} {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            <button onClick={() => setEdit(!edit)} className="px-5 py-2 rounded-lg bg-[#E6D8B5] text-[#0F172A] font-semibold hover:bg-[#FFFFFF] transition-all">
              {edit ? t('profile.cancel_button') : t('profile.edit_button')}
            </button>
          </div>
        </div>

        <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#E6D8B5]/30">
          <h2 className="text-lg font-semibold mb-4 text-[#E6D8B5]">{t('profile.info_title')}</h2>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-400">{t('profile.email_label')}</span>
              <p className="text-white">{user.email}</p>
            </div>
            <div>
              <span className="text-gray-400">{t('profile.favorite_coin_label')}</span>
              <p className="text-white">{user.favoriteCoin}</p>
            </div>
          </div>

          {socialPlatforms.some(p => user[p.key]) && (
            <div className="mt-6">
              <h3 className="text-base font-medium mb-3 text-[#E6D8B5]">{t('profile.social_title')}</h3>
              <div className="flex flex-wrap gap-3">
                {socialPlatforms.map(({ key, icon: Icon, base }) =>
                  user[key] ? (
                    <a
                      key={key}
                      href={`${base}/${user[key]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0F172A] border border-[#E6D8B5]/30 hover:bg-[#1E293B] transition"
                    >
                      <Icon size={18} className="text-[#E6D8B5]" />
                      <span className="text-white text-sm capitalize">{key}</span>
                    </a>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>

        {edit && (
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#E6D8B5]/30">
            <h2 className="text-xl font-bold mb-4 text-[#E6D8B5]">{t('profile.edit_title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm mb-1">{t('profile.username_label')}</label>
                <input className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-[#E6D8B5]/30 text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#E6D8B5]" value={user.username} onChange={e => setUser({ ...user, username: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm mb-1">{t('profile.email_label')}</label>
                <input type="email" className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-[#E6D8B5]/30 text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#E6D8B5]" value={user.email} onChange={e => setUser({ ...user, email: e.target.value })} />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1">{t('profile.favorite_coin_label')}</label>
              <input className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-[#E6D8B5]/30 text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#E6D8B5]" value={user.favoriteCoin} onChange={e => setUser({ ...user, favoriteCoin: e.target.value })} />
            </div>

            <div className="space-y-3">
              {socialPlatforms.map(({ key, icon: Icon, base }) => (
                <div key={key} className="flex items-center gap-3">
                  <Icon size={22} className="text-[#E6D8B5] shrink-0" />
                  <input
                    className="flex-1 px-3 py-2 rounded-lg bg-[#0F172A] border border-[#E6D8B5]/30 text-[#FFFFFF] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E6D8B5]"
                    value={user[key]}
                    onChange={e => setUser({ ...user, [key]: e.target.value })}
                    placeholder={`@${key}`}
                  />
                  {user[key] && (
                    <button
                      type="button"
                      onClick={() => window.open(`${base}/${user[key]}`, '_blank', 'noopener,noreferrer')}
                      className="px-3 py-2 rounded-lg bg-[#E6D8B5] text-[#0F172A] font-semibold hover:bg-white transition"
                    >
                      {t('profile.visit_button')}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button onClick={updateProfile} className="px-6 py-3 rounded-lg bg-[#E6D8B5] text-[#0F172A] font-semibold hover:bg-white transition">
                {t('profile.save_button')}
              </button>
            </div>

            {message && <p className="text-center mt-4 text-sm text-[#E6D8B5]">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}