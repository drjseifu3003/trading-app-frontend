import type React from "react"
import type { ReactNode } from "react"

type CardProps = {
  title: string
  children: ReactNode
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  const cardStyle = {
    border: "1px solid #eaeaea",
    borderRadius: "10px",
    padding: "20px",
    margin: "20px 0",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  }

  const titleStyle = {
    marginTop: 0,
    marginBottom: "15px",
    fontSize: "1.5rem",
  }

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>{title}</h2>
      {children}
    </div>
  )
}

export default Card
