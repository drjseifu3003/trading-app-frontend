"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
};

type StaticMarketItem = {
  id: string;
  symbol: string;
  name: string;
  change24h: number;
};

const forexList: StaticMarketItem[] = [
  { id: "usd", symbol: "USD", name: "US Dollar", change24h: 0.12 },
  { id: "eur", symbol: "EUR", name: "Euro", change24h: -0.07 },
  { id: "jpy", symbol: "JPY", name: "Japanese Yen", change24h: 0.05 },
  { id: "gbp", symbol: "GBP", name: "British Pound", change24h: 0.20 },
];

const goldList: StaticMarketItem[] = [
  { id: "xau", symbol: "XAU", name: "Gold Ounce", change24h: -0.15 },
  { id: "xag", symbol: "XAG", name: "Silver Ounce", change24h: 0.08 },
];

const MarketTabs = () => {
  const [cryptoList, setCryptoList] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("crypto");

  useEffect(() => {
    if (activeTab === "crypto") {
      setLoading(true);
      setError(null);

      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch");
          return res.json();
        })
        .then((data) => {
          setCryptoList(data);
          setLoading(false);
        })
        .catch((e) => {
          setError(e.message);
          setLoading(false);
        });
    }
  }, [activeTab]);

  const renderTable = (
  data: Coin[] | StaticMarketItem[],
  isCrypto: boolean
) => (
  <table className="w-full border-collapse border border-gray-300 text-sm">
    <thead>
      <tr className="bg-gray-100">
        <th className="border border-gray-300 py-2 px-3 text-left">Name</th>
        <th className="border border-gray-300 py-2 px-3 text-left">Symbol</th>
        <th className="border border-gray-300 py-2 px-3 text-right">24h Change %</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item) => {
        const change = isCrypto
          ? (item as Coin).price_change_percentage_24h
          : (item as StaticMarketItem).change24h;
        const id = item.id;
        const isPositive = change >= 0;
        const name = item.name;
        const symbol = item.symbol.toUpperCase();
        const image = isCrypto ? (item as Coin).image : undefined;

        return (
          <tr key={id} className="hover:bg-gray-50 cursor-pointer" title={name}>
            <td className="border border-gray-300 py-2 px-3 flex items-center gap-2">
              {isCrypto ? (
                <Link href={`/market/${id}`} className="flex items-center gap-2 w-full">
                  {image && (
                    <img
                      src={image}
                      alt={name}
                      className="w-5 h-5 rounded-full"
                      loading="lazy"
                    />
                  )}
                  <span>{name}</span>
                </Link>
              ) : (
                <span>{name}</span>
              )}
            </td>
            <td className="border border-gray-300 py-2 px-3">
              {isCrypto ? (
                <Link href={`/market/${id}`} className="block w-full">
                  {symbol}
                </Link>
              ) : (
                <span>{symbol}</span>
              )}
            </td>
            <td
              className={`border border-gray-300 py-2 px-3 text-right font-semibold ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isCrypto ? (
                <Link href={`/market/${id}`} className="block w-full">
                  {change.toFixed(2)}%
                </Link>
              ) : (
                <span>{change.toFixed(2)}%</span>
              )}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Tabs
        defaultValue="crypto"
        onValueChange={(val) => setActiveTab(val)}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="forex">Forex</TabsTrigger>
          <TabsTrigger value="gold">Gold</TabsTrigger>
        </TabsList>

        <TabsContent value="crypto">
          {loading && <p>Loading top 10 cryptocurrencies...</p>}
          {error && <p className="text-red-600">Error: {error}</p>}
          {!loading && !error && renderTable(cryptoList, true)}
        </TabsContent>

        <TabsContent value="forex">{renderTable(forexList, false)}</TabsContent>

        <TabsContent value="gold">{renderTable(goldList, false)}</TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketTabs;
