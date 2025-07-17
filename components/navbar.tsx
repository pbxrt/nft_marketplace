'use client';
import { useConnect, useDisconnect } from 'wagmi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet as WalletIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useAddress, { useChain } from '@/hooks/useAddress';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function Navbar() {
  const pathname = usePathname();
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'My NFT', href: '/my-nfts' },
  ];
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect()
  const address = useAddress();
  const chainId = useChain();
  console.log('address =>', address);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (address) {
      setOpen(false);
    }
  }, [address])

  const connectWallet = () => {
    setOpen(true);
  }

  const onDisconnect = () => {
    console.log('disconnect');
    disconnect();
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  return (
    <nav className="border-b sticky top-0 z-1 bg-gray-50/70 backdrop-filter backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NFT</span>
              </div>
              <span className="font-bold text-xl">NFT Market</span>
            </Link>

            <div className="hidden md:flex space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === item.href ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {address ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <WalletIcon className="w-4 h-4" />
                    <span>{formatAddress(address)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={onDisconnect}>
                      Disconnect
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      ChainId: {chainId}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={connectWallet} className="flex items-center space-x-2">
                <WalletIcon className="w-4 h-4" />
                <span>Connect Wallet</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to Wallet</DialogTitle>
          </DialogHeader>
          <div>
            {(connectors || []).map(connector => (
              <div key={connector.id} onClick={() => connect({ connector, chainId })}>{connector.name}</div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  )
}