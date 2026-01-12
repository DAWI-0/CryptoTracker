import { useEffect, useState } from "react";
import api from "../api/axios";
import Toast from "../components/Toast";
import { useTranslation } from "react-i18next";

export default function Trade() {
  const { t } = useTranslation();
  const [coins, setCoins] = useState([]);
  const [buyForm, setBuyForm] = useState({ coin: "BTC", amount: "", type: "buy" });
  const [sellForm, setSellForm] = useState({ coin: "BTC", amount: "", price: "" });
  const [showSell, setShowSell] = useState(false);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    api.get("/crypto")
      .then(res => setCoins(res.data))
      .catch(() => triggerToast(t('trade.toast.loading_error'), "error"));
  }, []);

  const handleBuy = async e => {
    e.preventDefault();

    if (!buyForm.amount || isNaN(buyForm.amount) || Number(buyForm.amount) <= 0) {
      triggerToast(t('trade.toast.invalid_amount'), "warning");
      return;
    }

    try {
      const coinData = coins.find(c => c.symbol === buyForm.coin);
      await api.post("/transactions", {
        coin: buyForm.coin,
        amount: Number(buyForm.amount),
        price_usd: coinData.price_usd,
        type: "buy"
      });

      triggerToast(t('trade.toast.buy_success'), "success");
      setBuyForm({ ...buyForm, amount: "" });
    } catch {
      triggerToast(t('trade.toast.buy_error'), "error");
    }
  };

  const handleSell = async e => {
    e.preventDefault();

    if (!sellForm.amount || !sellForm.price) {
      triggerToast(t('trade.toast.fill_all'), "warning");
      return;
    }

    try {
      await api.post("/offers", {
        coin: sellForm.coin,
        amount: Number(sellForm.amount),
        price_usd: Number(sellForm.price)
      });

      triggerToast(t('trade.toast.sell_success'), "success");
      setSellForm({ coin: "BTC", amount: "", price: "" });
      setShowSell(false);
    } catch {
      triggerToast(t('trade.toast.sell_error'), "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#FFFFFF] pt-20 px-6">
      <div className="max-w-2xl mx-auto space-y-8">

        <h1 className="text-3xl font-extrabold text-center text-[#E6D8B5]">{t('trade.title')}</h1>

        {showSell ? (
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#E6D8B5]/30">
            <h2 className="text-xl font-semibold mb-4 text-[#E6D8B5]">{t('trade.sell_tab')}</h2>
            <form onSubmit={handleSell} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-[#E6D8B5]">{t('trade.crypto_label')}</label>
                <select
                  value={sellForm.coin}
                  onChange={e => setSellForm({ ...sellForm, coin: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-[#E6D8B5]/30 text-white focus:outline-none focus:ring-2 focus:ring-[#E6D8B5]"
                >
                  {coins.map(c => (
                    <option key={c.symbol} value={c.symbol}>{c.name} ({c.symbol})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-[#E6D8B5]">{t('trade.sell_amount_label')}</label>
                <input
                  type="number"
                  step="0.000001"
                  value={sellForm.amount}
                  onChange={e => setSellForm({ ...sellForm, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-[#E6D8B5]/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E6D8B5]"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-[#E6D8B5]">{t('trade.price_label')}</label>
                <input
                  type="number"
                  step="0.01"
                  value={sellForm.price}
                  onChange={e => setSellForm({ ...sellForm, price: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-[#E6D8B5]/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E6D8B5]"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-green-700 text-white font-semibold hover:bg-green-600 transition">
                  {t('trade.publish_offer')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSell(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
                >
                  {t('trade.cancel')}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#E6D8B5]/30">
            <h2 className="text-xl font-semibold mb-4 text-[#E6D8B5]">{t('trade.buy_tab')}</h2>
            <form onSubmit={handleBuy} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-[#E6D8B5]">{t('trade.crypto_label')}</label>
                <select
                  value={buyForm.coin}
                  onChange={e => setBuyForm({ ...buyForm, coin: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-[#E6D8B5]/30 text-white focus:outline-none focus:ring-2 focus:ring-[#E6D8B5]"
                >
                  {coins.length === 0 && <option disabled>Chargement...</option>}
                  {coins.map(c => (
                    <option key={c.symbol} value={c.symbol}>{c.name} ({c.symbol})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-[#E6D8B5]">{t('trade.amount_label')}</label>
                <input
                  type="number"
                  step="0.000001"
                  value={buyForm.amount}
                  onChange={e => setBuyForm({ ...buyForm, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-[#E6D8B5]/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E6D8B5]"
                  placeholder="0.00"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-[#E6D8B5] text-[#0F172A] font-semibold hover:bg-white transition"
              >
                {t('trade.buy_button')}
              </button>
            </form>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => setShowSell(prev => !prev)}
            className="px-6 py-2 rounded-lg bg-[#E6D8B5] text-[#0F172A] font-semibold hover:bg-white transition"
          >
            {showSell ? t('trade.switch_to_buy') : t('trade.switch_to_sell')}
          </button>
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}