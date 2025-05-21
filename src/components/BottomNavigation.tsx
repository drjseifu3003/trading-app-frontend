"use client"

import { useState } from "react"
import type React from "react"
import { useRouter } from "next/navigation"

import { HomeIcon, ChartBarIcon, CircleInfoIcon, BellIcon, UserIcon } from "./Icons"

const BottomNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home")
  const router = useRouter()

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`/dashboard/${tab}`)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto flex justify-around items-center bg-white h-16 shadow-[0_-2px_5px_rgba(0,0,0,0.1)]">
      <NavItem
        icon={<HomeIcon active={activeTab === "home"} />}
        label="Home"
        isActive={activeTab === "home"}
        onClick={() => handleTabChange("home")}
      />
      <NavItem
        icon={<ChartBarIcon active={activeTab === "trading"} />}
        label="Trading"
        isActive={activeTab === "trading"}
        onClick={() => handleTabChange("trading")}
      />
      <NavItem
        icon={<BellIcon active={activeTab === "news"} />}
        label="News"
        isActive={activeTab === "news"}
        onClick={() => handleTabChange("news")}
      />
      <NavItem
        icon={<UserIcon active={activeTab === "personal"} />}
        label="Personal"
        isActive={activeTab === "personal"}
        onClick={() => handleTabChange("personal")}
      />
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full cursor-pointer" onClick={onClick}>
      <div className="mb-1">{icon}</div>
      <span className={`text-xs ${isActive ? "text-amber-500" : "text-gray-500"}`}>{label}</span>
    </div>
  )
}

export default BottomNavigation
