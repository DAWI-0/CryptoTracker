import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Trade from "./pages/Trade.jsx";
import api from "./api/axios";

function App() {
  const { i18n } = useTranslation();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user/me", { withCredentials: true });
        setUser(res.data.user || null);
      } catch (err) {
        console.log("Erreur lors de la récupération de l'utilisateur :", err.response?.data || err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <Router>
      <Navbar user={user} />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register setUser={setUser} />}
          />

          <Route
            path="/profile"
            element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />}
          />

          <Route
            path="/dashboard"
            element={user?.role === "admin" ? <Dashboard /> : <Navigate to="/" />}
          />

          <Route path="/transactions" element={<Transactions user={user} />} />
          <Route path="/trade" element={user ? <Trade /> : <Navigate to="/login" />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;