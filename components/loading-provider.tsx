'use client'

import React, { createContext, useContext, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogClose } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

type LoadingContextType = {
  showLoading: () => void
  hideLoading: () => void
  isLoading: boolean
}

const LoadingContext = createContext<LoadingContextType | null>(null)

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false)

  const showLoading = () => setIsLoading(true)
  const hideLoading = () => setIsLoading(false)

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}
      <Dialog open={isLoading} onOpenChange={hideLoading}>
        <DialogContent className="flex items-center justify-center">
          <DialogClose className="hidden" />
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <Loader2 className="animate-spin w-10 h-10 text-muted-foreground" />
        </DialogContent>
        
      </Dialog>
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) throw new Error('useLoading must be used within LoadingProvider')
  return context
}
