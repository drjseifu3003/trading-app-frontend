"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppSelector } from "@/src/store"
import { selectIsAuthenticated } from "@/src/store/slices/authSlice"

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, router, pathname])

  if (!isAuthenticated) return null // or a loading spinner

  return <>{children}</>
}
