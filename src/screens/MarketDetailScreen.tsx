"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import OptionsModal from "../components/OptionModal";
import CandlestickChart from "../components/CandleStickChart";

interface MarketProps {
  slug: string
}

const MarketDetailScreen = ({slug}: MarketProps) => {
  const router = useRouter();
  const coinId = Array.isArray(slug) ? "bitcoin" : slug?.toLowerCase();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [timeInterval, setTimeInterval] = useState("1h");
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}`
        );
        if (!response.ok) throw new Error("Failed to fetch market data");
        const json = await response.json();
        setData(json);
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coinId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <p className="text-red-400 mb-4">Error loading market data</p>
        <button
          onClick={() => router.back()}
          className="bg-amber-500 text-black px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const price = parseFloat(data.market_data.current_price.usd).toFixed(2);
  const priceChangePercent = parseFloat(
    data.market_data.price_change_percentage_24h
  ).toFixed(2);
  const highPrice = parseFloat(data.market_data.high_24h.usd).toFixed(2);
  const lowPrice = parseFloat(data.market_data.low_24h.usd).toFixed(2);
  const volume = parseFloat(data.market_data.total_volume.usd).toFixed(2);
  const marketCap = parseFloat(data.market_data.market_cap.usd).toFixed(2);

  const getDaysFromInterval = (interval: string): number => {
    switch (interval) {
      case "1m":
      case "5m":
      case "15m":
      case "30m":
      case "1h":
      case "2h":
      case "4h":
        return 1;
      case "D":
        return 7;
      case "W":
        return 30;
      case "M":
        return 90;
      default:
        return 1;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={() => router.back()} className="text-white text-xl">
          ←
        </button>
        <h1 className="text-xl font-bold capitalize">{coinId}</h1>
        <div className="w-6" />
      </div>

      {/* Price and Stats */}
      <div className="px-4 pb-4">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-green-400">${price}</span>
          <span
            className={`ml-4 ${
              priceChangePercent.startsWith("-")
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {priceChangePercent}%
          </span>
        </div>
        <div className="text-gray-400 text-sm">≈ ${price}</div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-gray-400 text-sm">High</div>
            <div className="text-green-400">${highPrice}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm">Low</div>
            <div className="text-green-400">${lowPrice}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Volume (24H)</div>
            <div className="text-green-400">${volume}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm">Market Cap</div>
            <div className="text-green-400">${marketCap}</div>
          </div>
        </div>
      </div>

      {/* Time Interval Tabs */}
      <div className="flex border-b border-gray-800">
        {["1m", "5m", "15m", "30m", "1h", "2h", "4h", "D", "W", "M"].map(
          (interval) => (
            <button
              key={interval}
              className={`flex-1 py-2 text-center text-sm ${
                timeInterval === interval
                  ? "text-amber-500 border-b border-amber-500"
                  : "text-gray-400"
              }`}
              onClick={() => setTimeInterval(interval)}
            >
              {interval}
            </button>
          )
        )}
      </div>

      {/* Chart */}
      <div className="flex-1 relative px-2">
        <CandlestickChart
          coinId={coinId ?? ""}
          days={getDaysFromInterval(timeInterval)}
        />
      </div>

      {/* Bottom Actions */}
      <div className="grid grid-cols-1 gap-4 p-4">
        {/* <button className="bg-amber-500 text-black py-3 rounded font-medium">
          Contract
        </button> */}
        <button
          className="bg-amber-500 text-black py-3 rounded font-medium"
          onClick={() => setIsOptionsModalOpen(true)}
        >
          Option
        </button>
      </div>

      {/* Option Modal */}
      <OptionsModal
      price="23448"
      changePercent="3"
       symbol={Array.isArray(slug) ? "bitcoin" : (slug?.toLowerCase() ?? "")}
        isOpen={isOptionsModalOpen}
        onClose={() => setIsOptionsModalOpen(false)}
      />
    </div>
  );
};

export default MarketDetailScreen;
