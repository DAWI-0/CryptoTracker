import { useEffect, useState } from "react";
import api from "../api/axios";

import { useTranslation } from "react-i18next";

export default function Transactions() {
  const { t } = useTranslation();
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/transactions"),  
      api.get("/offers")          
    ])
      .then(([txRes, sellRes]) => {
        const buys = txRes.data.map(t => ({ ...t, type: "buy", date: t.createdAt }));
        const sells = sellRes.data.map(o => ({ ...o, type: "sell", date: o.createdAt }));
        setTxs([...buys, ...sells].sort((a, b) => new Date(b.date) - new Date(a.date)));
      })
      .catch(() => alert(t('transactions.error')));
  }, []);

  if (!txs.length) return (
    <div className="min-h-screen bg-[#0F172A] text-[#FFFFFF] pt-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-extrabold text-center text-[#E6D8B5] mb-4">{t('transactions.title')}</h1>
        <p className="text-gray-400">{t('transactions.empty')}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#FFFFFF] pt-20 px-6">
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-3xl font-extrabold text-center text-[#E6D8B5]">{t('transactions.title')}</h1>

        <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#E6D8B5]/30 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#E6D8B5]/30">
                <th className="px-4 py-3 text-left text-[#E6D8B5] font-semibold">{t('transactions.table.date')}</th>
                <th className="px-4 py-3 text-left text-[#E6D8B5] font-semibold">{t('transactions.table.coin')}</th>
                <th className="px-4 py-3 text-left text-[#E6D8B5] font-semibold">{t('transactions.table.type')}</th>
                <th className="px-4 py-3 text-left text-[#E6D8B5] font-semibold">{t('transactions.table.amount')}</th>
                <th className="px-4 py-3 text-left text-[#E6D8B5] font-semibold">{t('transactions.table.price_usd')}</th>
                <th className="px-4 py-3 text-left text-[#E6D8B5] font-semibold">{t('transactions.table.total')}</th>
              </tr>
            </thead>

            <tbody>
              {txs.map(tx => (
                <tr key={tx.id} className="border-b border-[#E6D8B5]/20 hover:bg-[#0F172A] transition">
                  <td className="px-4 py-3 text-white text-xs">{new Date(tx.date).toLocaleString()}</td>
                  <td className="px-4 py-3 text-white font-medium">{tx.coin}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${tx.type === "buy" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                      }`}>
                      {tx.type === "buy" ? t('transactions.type.buy') : t('transactions.type.sell')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white">{tx.amount}</td>
                  <td className="px-4 py-3 text-white">${Number(tx.price_usd).toFixed(2)}</td>
                  <td className="px-4 py-3 text-white">${(tx.amount * tx.price_usd).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}