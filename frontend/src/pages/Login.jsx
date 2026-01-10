import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import { useTranslation } from "react-i18next";

export default function Login({ setUser }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || t('login.error'));
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold">{t('login.title')}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        className="w-full p-2 border rounded"
        placeholder={t('login.email_placeholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="w-full p-2 border rounded"
        placeholder={t('login.password_placeholder')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="bg-black text-white w-full p-2 rounded">{t('login.button')}</button>
    </form>
  );
}