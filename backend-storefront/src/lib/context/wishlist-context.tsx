"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"

const STORAGE_KEY = "medpharma_wishlist"

interface WishlistContext {
  items: string[]
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  toggleItem: (productId: string) => void
  hasItem: (productId: string) => boolean
  count: number
}

const WishlistContext = createContext<WishlistContext | null>(null)

function getStoredItems(): string[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setItems(getStoredItems())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = useCallback((productId: string) => {
    setItems((prev) => (prev.includes(productId) ? prev : [...prev, productId]))
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((id) => id !== productId))
  }, [])

  const toggleItem = useCallback((productId: string) => {
    setItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }, [])

  const hasItem = useCallback(
    (productId: string) => items.includes(productId),
    [items]
  )

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        toggleItem,
        hasItem,
        count: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === null) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
