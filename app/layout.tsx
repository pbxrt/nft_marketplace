'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ContractProvider } from "@/contexts/contract-context";
import { Navbar } from '@/components/navbar';
import { LoadingProvider } from '@/components/loading-provider';
import { Toaster } from "@/components/ui/sonner"
import { WagmiProvider } from 'wagmi';
import { config } from '@/contexts/wagmiConfig';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SwitchToValidChain from '@/components/SwitchToValidChain';
import {
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
const queryClient = new QueryClient()

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "NFT Market",
//   description: "A decentralized NFT marketplace",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider locale="en" theme={darkTheme()}>
              <LoadingProvider>
                <ContractProvider>
                  {/* 如果是不支持的链，需要引导用户切换到支持的链 */}
                  <SwitchToValidChain />
                  <div className="min-h-screen bg-background">
                    <Navbar />
                    <main>{children}</main>
                    <Toaster position="top-center" richColors />
                  </div>
                </ContractProvider>
              </LoadingProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
