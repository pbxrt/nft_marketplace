'use client';
import { createContext, useContext, useState, useEffect } from 'react';

interface WalletContextType {
  isConnected: boolean;
  address: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

declare global {
  interface Window {
    ethereum: any;
  }
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);
const LOCAL_CHAIN_ID = '0x7a69'
export function WalletProvider({ children } : { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }

    window.ethereum.request({
      method: 'eth_accounts',
    }).then((accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      }
    });

    window.ethereum.on('accountsChanged', (accounts) => {
      console.log(accounts);
      window.location.reload();
    })
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.log('Please install MetaMask');
      return;
    }

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });

      if (chainId !== LOCAL_CHAIN_ID) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: LOCAL_CHAIN_ID }]
        });
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const [walletAddress] = accounts;
        setAddress(walletAddress);
        setIsConnected(true);

        console.log('Wallet connected:', walletAddress);
      } else {
        console.log('No accounts found');
      }
    } catch (error) {
      console.error('Failed to connect wallet: ', error);
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress('');

    console.log('Wallet disconnected');
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}