
import ProtectedPage from "@/components/protectedPage"
import TradingScreen from "@/src/screens/TradingScreen"

export default function TradingPage() {
    return (
    <ProtectedPage>
       <TradingScreen />
    </ProtectedPage>
    )
}