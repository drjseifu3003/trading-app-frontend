"use client"

import type React from "react"
import type { ReactNode } from "react"

interface FeatureCardProps {
  title: string
  description: string
  icon?: ReactNode
  buttonText?: string
  onButtonClick?: () => void
  bgColor?: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  buttonText,
  onButtonClick,
  bgColor = "bg-amber-100",
}) => {
  return (
    <div className={`${bgColor} rounded-xl p-5 mx-3 my-4 relative`}>
      {icon && <div className="mb-3">{icon}</div>}
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-700">{description}</p>
      {buttonText && (
        <button
          onClick={onButtonClick}
          className="absolute right-5 top-5 bg-white text-gray-800 px-5 py-2 rounded-full font-bold"
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}

export default FeatureCard
