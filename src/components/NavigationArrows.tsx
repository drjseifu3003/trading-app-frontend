"use client"

import type React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons"

interface NavigationArrowsProps {
  onPrev?: () => void
  onNext?: () => void
}

const NavigationArrows: React.FC<NavigationArrowsProps> = ({ onPrev, onNext }) => {
  return (
    <div className="flex justify-between px-3 my-3">
      <div className="cursor-pointer" onClick={onPrev}>
        <ChevronLeftIcon />
      </div>
      <div className="cursor-pointer" onClick={onNext}>
        <ChevronRightIcon />
      </div>
    </div>
  )
}

export default NavigationArrows
