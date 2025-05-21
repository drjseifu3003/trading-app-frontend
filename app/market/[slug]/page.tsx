import ProtectedPage from "@/components/protectedPage";
import MarketDetailScreen from "@/src/screens/MarketDetailScreen";
import { CryptoItem } from "@/src/store/api/marketApi";

interface PageProps {
  params: {
    slug: string;
  };
}

const MarketPage = ({ params }: PageProps) => {
  const { slug } = params;
  return (
    <ProtectedPage>
      <MarketDetailScreen slug={slug} />
    </ProtectedPage>
  );
};

export default MarketPage;

// ✅ Generate static params from CoinGecko
export async function generateStaticParams() {
  try {
    // Fetch top coins from CoinGecko (you can limit to a specific number)
    // const res = await fetch('https://api.coingecko.com/api/v3/coins/list');
    // const coins: { id: string; symbol: string; name: string }[] = await res.json();

    // You can filter to only include top coins you're interested in
    const coinsToTrack = ['bitcoin', 'ethereum', 'litecoin', 'binancecoin'];

    // const filteredCoins = c.filter((coin) =>
    //   coinsToTrack.includes(coin.id)
    // );

    return coinsToTrack.map((coin) => ({
      slug: coin,
    }));
  } catch (error) {
    console.error('Failed to fetch CoinGecko coin list:', error);
    return [];
  }
}
