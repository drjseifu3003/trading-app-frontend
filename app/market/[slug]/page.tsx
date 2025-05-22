// app/market/[slug]/page.tsx

import ProtectedPage from "@/components/protectedPage";
import MarketDetailScreen from "@/src/screens/MarketDetailScreen";

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

// ✅ Pre-generate top 10 coin slugs from CoinGecko
export async function generateStaticParams() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
      {
        next: { revalidate: 3600 }, // Revalidate every hour (optional)
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch CoinGecko market data");
    }

    const coins: { id: string }[] = await res.json();

    // Return array of slugs for top 10 coins
    return coins.map((coin) => ({
      slug: coin.id,
    }));
  } catch (error) {
    console.error("Error generating static coin slugs:", error);
    return [];
  }
}
