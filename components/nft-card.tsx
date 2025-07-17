'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useContract } from '@/contexts/contract-context';
import useAddress from '@/hooks/useAddress';

interface NFT {
  tokenId: string;
  name: string;
  number: string;
  price: string;
  image: string;
  owner?: string;
  seller: string;
}

interface NFTCardProps {
  nft: NFT;
  showPurchaseButton: boolean;
}

export function NFTCard({ nft, showPurchaseButton }: NFTCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { purchaseNFT } = useContract();
  const address = useAddress();

  const handlePurchase = () => {
    purchaseNFT(nft);
  }

  const onClickCard = () => {
    console.log(nft);
  }

  return (
    <Card
      className="py-0 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClickCard}
    >
      <div className="relative aspect-square">
        <Image src={nft.image || '/placeholder.svg'} alt={nft.name} fill className="object-cover" />
        {showPurchaseButton && isHovered && (address?.toLowerCase() !== nft.seller.toLowerCase()) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-300">
            <Button className="flex items-center space-x-2 cursor-pointer" size="sm" onClick={handlePurchase}>
              <ShoppingCart className="w-4 h-4" />
              <span>Purchase</span>
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate">{nft.name}</h3>
          <Badge variant="secondary">#{nft.number}</Badge>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">{nft.price} ETH</span>
        </div>
      </CardContent>
    </Card>
  )
}