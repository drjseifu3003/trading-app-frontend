"use client"

import type React from "react"
import { useEffect, useState } from "react"
import SearchBar from "../components/SearchBar"
import TabGroup from "../components/TabGroup"
import CryptoCard from "../components/CryptoCard"
import MarketTable from "../components/MarketTable"
import FeatureCard from "../components/FeatureCard"
import NavigationArrows from "../components/NavigationArrows"
import { LockIcon, ClockIcon } from "../components/Icons"

type BinanceTicker = {
  symbol: string;
  lastPrice: string;          // string number like "104039.23"
  priceChangePercent: string; // string number like "-0.08"
};

type CryptoItem = {
  name: string;
  symbol: string;
  price: string;      // formatted price with commas, e.g. "104,039.23"
  change: string;     // formatted percent change, e.g. "-0.08%"
  isPositive: boolean;
};

const symbolsToTrack = ['BTCUSDT', 'ETHUSDT', 'LTCUSDT', 'BNBUSDT'];

const HomeScreen: React.FC = () => {
  const [ieoTab, setIeoTab] = useState("Popular")
  const [marketTab, setMarketTab] = useState("Forex")
  
  const [cryptoItems, setCryptoItems] = useState<CryptoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // const cryptoItems = [
  //   {
  //     name: "BTC",
  //     symbol: "BTCUSDT",
  //     price: "104,039.23",
  //     change: "-0.08%",
  //     isPositive: false,
  //   },
  //   {
  //     name: "ETH",
  //     symbol: "ETHUSDT",
  //     price: "2,615.33",
  //     change: "+3.81%",
  //     isPositive: true,
  //   },
  //   {
  //     name: "LTC",
  //     price: "102.02",
  //     symbol: "LTCUSDT",
  //     change: "+1.93%",
  //     isPositive: true,
  //   },
  //   {
  //     name: "BNB",
  //     price: "662.17",
  //     symbol: "BNBUSDT",
  //     change: "+1.64%",
  //     isPositive: true,
  //   },
  // ]

  const forexItems = [
    {
      name: "GBPUSD",
      symbol: "GBPUSD",
      price: "1.32937",
      change: "+0.29%",
      isPositive: true,
      icon: <span className="text-sm">🇬🇧</span>,
    },
    {
      name: "EURUSD",
      symbol: "EURUSD",
      price: "1.11708",
      change: "-0.11%",
      isPositive: false,
      icon: <span className="text-sm">🇪🇺</span>,
    },
    {
      name: "AUDUSD",
      symbol: "AUDUSD",
      price: "0.64733",
      change: "+0.77%",
      isPositive: true,
      icon: <span className="text-sm">🇦🇺</span>,
    },
  ]


  useEffect(() => {
    async function fetchCryptoItems() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        if (!res.ok) throw new Error('Network response was not ok');

        const data: BinanceTicker[] = await res.json();

        const items = symbolsToTrack
          .map(symbol => {
            const item = data.find(d => d.symbol === symbol);
            if (!item) return null;

            const changePercent = parseFloat(item.priceChangePercent);

            return {
              name: symbol.replace('USDT', ''),
              symbol: item.symbol,
              price: parseFloat(item.lastPrice).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              change: `${changePercent.toFixed(2)}%`,
              isPositive: changePercent >= 0,
            };
          })
          .filter((item): item is CryptoItem => item !== null);

        setCryptoItems(items);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchCryptoItems();
  }, []);


  return (
    <div>
      <SearchBar />

      <div className="bg-white rounded-lg mx-3 my-4 p-4 shadow">
        <h2 className="text-lg font-bold mb-3">MDEX Pro are powered by the MDEX Pro protocol Trusted by millions</h2>

        <div className="flex justify-center my-5 rounded-lg">
          <img
            src="/images/51L0aUuJsk_1742148932663.jpg"
            alt="Security Shield"
            className="rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-5">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">$23,590,878</div>
            <div className="text-sm text-gray-600">24h trading volume</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">350+</div>
            <div className="text-sm text-gray-600">Listed cryptocurrencies</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">1000+</div>
            <div className="text-sm text-gray-600">Partner organizations</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">0.01%</div>
            <div className="text-sm text-gray-600">Lowest transaction fees</div>
          </div>
        </div>
      </div>

      <FeatureCard
        title="AI Arbitrage"
        description="Generate passive income daily and earn profits."
        buttonText="Start"
        onButtonClick={() => console.log("Start AI Arbitrage")}
      />

      <div className="bg-white rounded-lg mx-3 my-4 p-4 shadow">
        <h2 className="text-xl font-bold text-center mb-3">IEO Market</h2>

        <TabGroup tabs={["Popular", "Subscribe", "Lottery"]} activeTab={ieoTab} onTabChange={setIeoTab} />
      </div>

      <div className="bg-white rounded-lg mx-3 my-4 p-4 shadow">
        <div className="flex gap-3 overflow-x-auto py-2">
          <CryptoCard name="BTCUSDT" price="$104,039.23" change="-0.08%" type="btc" />
          <CryptoCard name="ETHUSDT" price="$2,615.33" change="+3.81%" type="eth" />
        </div>

        <div className="mt-4">
          <MarketTable items={cryptoItems} isClick={true}/>
        </div>
      </div>

      <NavigationArrows />

      <div className="bg-white rounded-lg mx-3 my-4 p-4 shadow">
        <h2 className="text-xl font-bold text-center mb-3">Market dynamics</h2>

        <TabGroup tabs={["Forex", "Crypto", "GOLD"]} activeTab={marketTab} onTabChange={setMarketTab} />

        <div className="mt-4">
          <MarketTable items={forexItems} isClick={false}/>
        </div>
      </div>

      <NavigationArrows />

      <div className="bg-white rounded-lg mx-3 my-4 p-4 shadow">
        <h2 className="text-xl font-bold text-center mb-4">Start your cryptocurrency journey</h2>

        <div className="flex items-center mb-5">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center mr-4">
            <LockIcon />
          </div>
          <div>
            <h3 className="font-bold mb-1">Reliable security</h3>
            <p className="text-sm text-gray-600">
              Our advanced security measures and SAFU fund protect your digital assets from all risks.
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center mr-4">
            <ClockIcon />
          </div>
          <div>
            <h3 className="font-bold mb-1">24/7 customer support</h3>
            <p className="text-sm text-gray-600">
              24/7 operation, we will respond to your inquiries as soon as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="h-10"></div>
    </div>
  )
}

export default HomeScreen
