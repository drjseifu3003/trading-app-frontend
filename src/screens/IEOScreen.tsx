import type React from "react"
import SearchBar from "../components/SearchBar"

const IEOScreen: React.FC = () => {
  return (
    <div>
      <SearchBar />
      <div className="bg-white rounded-lg mx-3 my-4 p-4 shadow">
        <h2 className="text-xl font-bold text-center mb-3">IEO</h2>
        <p className="text-center py-10">IEO screen content will be displayed here.</p>
      </div>
    </div>
  )
}

export default IEOScreen
