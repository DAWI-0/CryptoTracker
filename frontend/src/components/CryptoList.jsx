import { useEffect, useState } from "react";
import api from "../api/axios";

import { useTranslation } from "react-i18next";

export default function CryptoList() {
  const { t } = useTranslation();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/crypto")  // <-- route backend correcte
      .then(res => {
        setCoins(res.data); // FreeCryptoAPI renvoie un tableau simple
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>{t('profile.loading')}</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {coins.map(c => (
        <div key={c.symbol} className="border p-4">
          <h3 className="font-bold">{c.name}</h3>
          <p>${Number(c.price_usd).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}