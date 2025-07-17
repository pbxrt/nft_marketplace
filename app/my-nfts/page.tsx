'use client';

import { useState}  from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NFTCard } from '@/components/nft-card';
// import { MintModal } from '@/components/mint-modal';
import useAddress from '@/hooks/useAddress';
import { useContract } from '@/contexts/contract-context'
import { MintModal } from '@/components/mint-modal';

export default function MyNFTsPage() {
  const [showMintModal, setShowMintModal] = useState(false);
  const address = useAddress();
  const { userNFTs } = useContract()

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground">Please connect your wallet to view your NFTs</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">My NFTs</h1>
          <p className="text-muted-foreground">Your digital collectibles</p>
        </div>
        <Button onClick={() => setShowMintModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Mint NFT
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {userNFTs.map(nft => (
          <NFTCard
            key={nft.number}
            nft={nft}
            showPurchaseButton={false}
          />
        ))}
      </div>

      {userNFTs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">You don&apos;t own any NFTs yet</p>
          <Button onClick={() => setShowMintModal(true)} className="mt-4" variant="outline">
            Mint Your First NFT
          </Button>
        </div>
      )}

      <MintModal open={showMintModal} onOpenChange={setShowMintModal} />
    </div>
  )
}