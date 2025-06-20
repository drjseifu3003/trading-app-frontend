"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function IndexPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard")
  }, [router])

  return <div>Redirecting to dashboard...</div>
}
