"use client"

import type React from "react"

type ButtonProps = {
  text: string
  onClick: () => void
  variant?: "primary" | "secondary"
}

const Button: React.FC<ButtonProps> = ({ text, onClick, variant = "primary" }) => {
  const buttonStyle = {
    padding: "10px 15px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    backgroundColor: variant === "primary" ? "#0070f3" : "#f5f5f5",
    color: variant === "primary" ? "white" : "black",
  }

  return (
    <button style={buttonStyle} onClick={onClick}>
      {text}
    </button>
  )
}

export default Button
