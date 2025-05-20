import MarketDetailScreen from "@/src/screens/MarketDetailScreen";
import { CryptoItem } from "@/src/store/api/marketApi";

interface PageProps {
  params: {
    slug: string;
  };
}


type BinanceTicker = {
  symbol: string;
  lastPrice: string;          // string number like "104039.23"
  priceChangePercent: string; // string number like "-0.08"
};


const MarketPage = ({ params }: PageProps) => {
  const { slug } = params;
  return <MarketDetailScreen slug={slug} />;
};

export default MarketPage;

// ✅ Generate static params from Binance symbols
export async function generateStaticParams() {

const symbolsToTrack = ['BTCUSDT', 'ETHUSDT', 'LTCUSDT', 'BNBUSDT'];

  // const data = await res.json();

  const symbols = symbolsToTrack
    .map((item) => ({
      slug: item,
    }));

  return symbols;
}
