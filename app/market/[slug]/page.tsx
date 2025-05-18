import MarketDetailScreen from "@/src/screens/MarketDetailScreen"
interface PageProps {
  params: {
    slug: string;
  };
}

const MarketPage = ({params} : PageProps) => {
  const { slug } = params
    return (
        <MarketDetailScreen slug={slug}/>
    )
}

export default MarketPage