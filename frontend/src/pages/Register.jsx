import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import { useTranslation } from "react-i18next";

export default function Register() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || t('register.error'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold">{t('register.title')}</h2>
      {error && <p className="text-red-500">{error}</p>}

      <input
        className="w-full p-2 border rounded"
        placeholder={t('register.username_placeholder')}
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
      />
      <input
        className="w-full p-2 border rounded"
        placeholder={t('register.email_placeholder')}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        className="w-full p-2 border rounded"
        placeholder={t('register.password_placeholder')}
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <button className="bg-black text-white w-full p-2 rounded">{t('register.button')}</button>
    </form>
  );
}