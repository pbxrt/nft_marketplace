import {
  http,
  // createConfig
} from 'wagmi'
import {
  sepolia,
} from 'wagmi/chains'
import { defineChain } from 'viem';
// import { walletConnect } from 'wagmi/connectors';
import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';

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

export const currentChain = isProd ? sepolia : hardhat;

// export const config = isProd ? createConfig({
//   chains: [sepolia],
//   transports: {
//     [sepolia.id]: http(),
//   },
//   connectors: [
//     walletConnect({
//       projectId: '233ac368c45497f9220b43a293b10299'
//     })
//   ]
// }) : createConfig({
//   chains: [hardhat],
//   transports: {
//     [hardhat.id]: http(),
//   },
//   connectors: [
//     walletConnect({
//       projectId: '233ac368c45497f9220b43a293b10299'
//     })
//   ]
// });

export const config = isProd ? getDefaultConfig({
  appName: 'NFT Marketplace',
  projectId: '233ac368c45497f9220b43a293b10299',
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/PypWHEhu6dQvkBxhvwKe_Aw-VM_Ejtjs')
  },
  ssr: true
}) : getDefaultConfig({
  appName: 'NFT Marketplace',
  projectId: '233ac368c45497f9220b43a293b10299',
  chains: [hardhat],
  ssr: true
})