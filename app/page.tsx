'use client';
import { useEffect } from 'react';
import { useContract } from '@/contexts/contract-context';
import { NFTCard } from '@/components/nft-card';
import { config } from '@/contexts/wagmiConfig';

export default function HomePage() {
  const { allNFTs } = useContract();

  useEffect(() => {
    console.log(config);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Discover NFTs</h1>
        <p className="text-muted-foreground">Explore and collect unique digital assets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allNFTs.map(nft => (
          <NFTCard
            key={nft.tokenId}
            nft={nft}
            showPurchaseButton={true}
          />
        ))}
      </div>

      {allNFTs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No NFTs availabel at the moment.</p>
        </div>
      )}
    </div>
  );
}
