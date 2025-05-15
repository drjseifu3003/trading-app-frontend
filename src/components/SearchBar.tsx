"use client"

import type React from "react"
import { useState } from "react"

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
    // Implement search functionality
  }

  return (
    <form className="flex mx-3 my-3 bg-white rounded overflow-hidden" onSubmit={handleSearch}>
      <input
        type="text"
        className="flex-1 px-4 py-2 outline-none text-base"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit" className="bg-amber-500 text-white px-5 py-2">
        Search
      </button>
    </form>
  )
}

export default SearchBar
