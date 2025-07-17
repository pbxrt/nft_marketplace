import { http, createConfig } from 'wagmi'
import {
  sepolia,
} from 'wagmi/chains'
import { defineChain } from 'viem';
import { walletConnect } from 'wagmi/connectors';

export const hardhat = defineChain({
  id: 31337,
  name: 'Hardhat',
  nativeCurrency: {
    name: 'GO',
    symbol: 'GO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
});

const isProd = process.env.NEXT_PUBLIC_ENV === 'prod';

export const config = isProd ? createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId: '233ac368c45497f9220b43a293b10299'
    })
  ]
}) : createConfig({
  chains: [hardhat],
  transports: {
    [hardhat.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId: '233ac368c45497f9220b43a293b10299'
    })
  ]
});

