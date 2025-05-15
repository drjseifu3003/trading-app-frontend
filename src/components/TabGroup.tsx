"use client"

import type React from "react"

interface TabGroupProps {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
  variant?: "default" | "underline"
}

const TabGroup: React.FC<TabGroupProps> = ({ tabs, activeTab, onTabChange, variant = "default" }) => {
  if (variant === "underline") {
    return (
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`flex-1 text-center py-3 cursor-pointer ${
              activeTab === tab ? "border-b-2 border-amber-500 font-medium" : ""
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex">
      {tabs.map((tab) => (
        <div key={tab} className={`tab ${activeTab === tab ? "active" : ""}`} onClick={() => onTabChange(tab)}>
          {tab}
        </div>
      ))}
    </div>
  )
}

export default TabGroup
