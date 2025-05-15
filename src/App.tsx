"use client"

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Header from "./components/Header"
import BottomNavigation from "./components/BottomNavigation"
import HomeScreen from "./screens/HomeScreen"
import TradingScreen from "./screens/TradingScreen"
import IEOScreen from "./screens/IEOScreen"
import NewsScreen from "./screens/NewsScreen"
import PersonalScreen from "./screens/PersonalScreen"
import MarketDetailScreen from "./screens/MarketDetailScreen"

// Main app layout with navigation
const AppLayout = () => {
  const location = useLocation()
  const path = location.pathname
  
  // Determine active tab based on current path
  const getActiveTab = () => {
    if (path === "/" || path.startsWith("/home")) return "home"
    if (path.startsWith("/trading")) return "trading"
    if (path.startsWith("/ieo")) return "ieo"
    if (path.startsWith("/news")) return "news"
    if (path.startsWith("/personal")) return "personal"
    return "home"
  }
  
  const activeTab = getActiveTab()

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-50 relative">
      <Header />
      <div className="flex-1 overflow-y-auto pb-16">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/trading" element={<TradingScreen />} />
          <Route path="/ieo" element={<IEOScreen />} />
          <Route path="/news" element={<NewsScreen />} />
          <Route path="/personal" element={<PersonalScreen />} />
        </Routes>
      </div>
      <BottomNavigation activeTab={activeTab} />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<AppLayout />} />
        <Route path="/market/:symbol" element={<MarketDetailScreen />} />
      </Routes>
    </Router>
  )
}

export default App