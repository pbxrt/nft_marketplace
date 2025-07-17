'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { abi as NFT_CONTRACT_ABI } from '@/constants/abi';
import { ethers } from 'ethers';
import { useLoading } from '@/components/loading-provider';
import { toast } from 'sonner';
import useAddress from '@/hooks/useAddress';

interface NFT {
  tokenId: string;
  name: string;
  number: string;
  price: string;
  image: string;
  seller?: string;
  currentlyListed?: boolean;
  owner?: string;
}

interface MintData {
  name: string;
  number: string;
  price: string;
  image: File | null;
}

interface ContractContextType {
  allNFTs: NFT[];
  userNFTs: NFT[];
  mintNFT: (data: MintData) => void;
  purchaseNFT: (nft: NFT) => void;
}

const NFT_CONRACT_ADDR = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export function ContractProvider({ children }: { children: ReactNode }) {
  const [allNFTs, setAllNFTs] = useState<NFT[]>([]);
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const { showLoading, hideLoading } = useLoading();
  const address = useAddress();

  const getAllNFTs = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const nftMarket = new ethers.Contract(NFT_CONRACT_ADDR, NFT_CONTRACT_ABI, provider);

    let allNftRes = await nftMarket.getAllNFTs();
    allNftRes = allNftRes.map((nft) => {
      const [tokenId, owner, seller, price, currentlyListed] = nft;
      return {
        tokenId,
        owner,
        seller,
        price,
        currentlyListed
      };
    });

    const nftTokenUriRes = await Promise.all(allNftRes.map(nft => {
      return nftMarket.tokenURI(nft.tokenId);
    }));

    await Promise.all(nftTokenUriRes.map((uri, index) => {
      return fetch(`https://ipfs.io/ipfs/${uri}`).then(res => res.json()).then((res => {
        allNftRes[index].image = res.image;
        allNftRes[index].name = res.name;
        allNftRes[index].number = res.number;
        allNftRes[index].price = res.price;
      }));
    }))
    console.log(allNftRes);

    setAllNFTs(allNftRes);
  }

  const getMyNFTs = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    // console.log(window.ethereum, '< window.ethereum');
    const nftMarket = new ethers.Contract(NFT_CONRACT_ADDR, NFT_CONTRACT_ABI, signer);

    let myNftRes = await nftMarket.getMyNFTs();
    myNftRes = myNftRes.map((nft) => {
      const [tokenId, owner, seller, price, currentlyListed] = nft;
      return {
        tokenId,
        owner,
        seller,
        price,
        currentlyListed
      };
    });

    const nftTokenUriRes = await Promise.all(myNftRes.map(nft => {
      return nftMarket.tokenURI(nft.tokenId);
    }));

    await Promise.all(nftTokenUriRes.map((uri, index) => {
      return fetch(`https://ipfs.io/ipfs/${uri}`).then(res => res.json()).then((res => {
        myNftRes[index].image = res.image;
        myNftRes[index].name = res.name;
        myNftRes[index].number = res.number;
        myNftRes[index].price = res.price;
      }));
    }))
    console.log(myNftRes);

    setUserNFTs(myNftRes);
  }

  useEffect(() => {
    if (address) {
      getAllNFTs();
      getMyNFTs();
    }
  }, [address]);

  const mintNFT = async (data: MintData) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const nftMarket = new ethers.Contract(NFT_CONRACT_ADDR, NFT_CONTRACT_ABI, signer);

    const listPrice = await nftMarket.getListPrice();
    const price = ethers.parseEther(data.price);

    let response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: JSON.stringify({
        name: data.name,
        number: data.number,
        price: data.price,
        image: data.image,
      }),
    });
    response = await response.json();

    const tx = await nftMarket.createToken(response.IpfsHash, price, {
      value: listPrice
    });

    await tx.wait();
    toast.success('NFT minted successfully');
    getMyNFTs();
    getAllNFTs();
  }

  const purchaseNFT = async (nft: NFT) => {
    showLoading();
    console.log(ethers.parseEther(nft.price));
    debugger;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const nftMarket = new ethers.Contract(NFT_CONRACT_ADDR, NFT_CONTRACT_ABI, signer);

      const tx = await nftMarket.executeSale(nft.tokenId, {
        value: ethers.parseEther(nft.price)
      });

      await tx.wait();
      toast.success('Successfully purchased NFT!');

      getMyNFTs();
    } catch (err) {
      console.log(err);
    }
    hideLoading();
  }

  return (
    <ContractContext.Provider
      value={{
        allNFTs,
        userNFTs,
        mintNFT,
        purchaseNFT
      }}
    >
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
}