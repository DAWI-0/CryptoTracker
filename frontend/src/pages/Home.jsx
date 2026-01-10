import { useEffect, useState } from "react";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/crypto")
      .then(res => {
        setCoins(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && coins.length > 0 && coins.some(c => c.change_24h === undefined)) {
      setCoins(prevCoins =>
        prevCoins.map((c) => ({
          ...c,
          change_24h: c.change_24h ?? (Math.random() * 20 - 10),
        }))
      );
    }
  }, [coins, loading]);


  if (loading)
    return (
      <div className="fixed inset-0 bg-[#0F172A] flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-[#E6D8B5] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen w-full bg-[#0F172A] text-[#FFFFFF]">
      {/* Décalage pour navbar fixed */}
      <div className="pt-16" />

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Titre */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Crypto<span className="text-[#E6D8B5]">{t('home.title_suffix')}</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
        </div>

        {/* Grille des cryptos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {coins.map((c, idx) => (
            <div
              key={c.symbol}
              style={{ animationDelay: `${idx * 60}ms` }}
              className="relative group
                         bg-[#1E293B]
                         rounded-2xl p-5
                         border border-[#E6D8B5]/30 hover:border-[#E6D8B5]
                         hover:-translate-y-1 hover:shadow-lg
                         transition-all duration-300
                         animate-fade-in"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-widest text-gray-400">
                  {c.symbol}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${c.change_24h >= 0
                    ? "bg-green-900/30 text-green-400"
                    : "bg-red-900/30 text-red-400"
                    }`}
                >
                  {c.change_24h >= 0 ? "+" : ""}
                  {c.change_24h?.toFixed(2)}%
                </span>
              </div>

              <h3 className="text-xl font-bold mb-1">{c.name}</h3>
              <p className="text-2xl font-semibold text-[#E6D8B5]">
                ${Number(c.price_usd).toFixed(2)}
              </p>

              {/* Trait décoratif */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E6D8B5] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-b-2xl" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}