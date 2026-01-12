import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import {
  Users, CreditCard, ShoppingBag, TrendingUp, Download,
  Settings, AlertCircle, Search, MoreVertical
} from "lucide-react";

import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = () => {
    setLoading(true);
    api.get("/dashboard")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert(t('dashboard.loading_error'));
        setLoading(false);
      });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#E6D8B5] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-[#E6D8B5] selection:text-[#0F172A] mt-10">

      <main className="max-w-7xl mx-auto p-8 space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title={t('dashboard.stats.users')}
            value={data.stats.userCount}
            icon={<Users size={24} />}
            trend={"+12% " + t('dashboard.trend.month')}
          />
          <StatCard
            title={t('dashboard.stats.transactions')}
            value={data.stats.txCount}
            icon={<CreditCard size={24} />}
            trend={"+5% " + t('dashboard.trend.month')}
          />
          <StatCard
            title={t('dashboard.stats.offers')}
            value={data.stats.offerCount}
            icon={<ShoppingBag size={24} />}
            trend="Stable"
          />
        </div>

        <div className="gap-8">
          <div className="lg:col-span-2 bg-[#1E293B] border border-[#E6D8B5]/20 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-[#E6D8B5] flex items-center gap-2">
                <TrendingUp size={20} /> {t('dashboard.chart.title')}
              </h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData}>
                  <defs>
                    <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E6D8B5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#E6D8B5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#E6D8B5', color: '#fff' }}
                    itemStyle={{ color: '#E6D8B5' }}
                  />
                  <Area type="monotone" dataKey="transactions" stroke="#E6D8B5" strokeWidth={3} fillOpacity={1} fill="url(#colorTx)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#1E293B] border border-[#E6D8B5]/20 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#E6D8B5]/10 flex justify-between items-center">
              <h3 className="font-semibold text-[#E6D8B5]">{t('dashboard.recent_tx.title')}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#0F172A] text-gray-200 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">{t('dashboard.recent_tx.coin')}</th>
                    <th className="px-6 py-3">{t('dashboard.recent_tx.amount')}</th>
                    <th className="px-6 py-3">{t('dashboard.recent_tx.date')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6D8B5]/10">
                  {data.recentTx.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#0F172A]/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{tx.coin}</td>
                      <td className="px-6 py-4 text-[#E6D8B5]">{tx.amount}</td>
                      <td className="px-6 py-4">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#1E293B] border border-[#E6D8B5]/20 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-[#E6D8B5]/10 flex justify-between items-center">
              <h3 className="font-semibold text-[#E6D8B5]">{t('dashboard.recent_offers.title')}</h3>
            </div>
            <div className="space-y-4 p-6">
              {data.recentOffers.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl border border-[#E6D8B5]/10 hover:border-[#E6D8B5]/40 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1E293B] flex items-center justify-center text-[#E6D8B5]">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-[#E6D8B5] transition-colors">{offer.coin}</p>
                      <p className="text-xs text-gray-500">{t('dashboard.recent_offers.amount_label')} {offer.amount}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[#E6D8B5] text-sm">${Number(offer.price_usd).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}


function StatCard({ title, value, icon, trend }) {
    const { t } = useTranslation();
  return (
    <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#E6D8B5]/20 shadow-lg hover:border-[#E6D8B5]/50 transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className="p-3 bg-[#0F172A] rounded-xl text-[#E6D8B5]">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs">
        <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md font-medium">
          {trend}
        </span>
        <span className="ml-2 text-gray-500">{t('dashboard.trend.month')}</span>
      </div>
    </div>
  );
}

function ActionButton({ label, alert = false }) {
  return (
    <button className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group ${alert
      ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
      : "bg-[#0F172A] text-gray-300 border border-[#E6D8B5]/10 hover:border-[#E6D8B5]/50 hover:text-white"
      }`}>
      {label}
      {alert && <AlertCircle size={16} />}
      {!alert && <Settings size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#E6D8B5]" />}
    </button>
  );
}