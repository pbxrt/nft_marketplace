import { http, createConfig } from 'wagmi'
import {
  // sepolia,
  localhost
} from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [
    localhost,
    // sepolia
  ],
  transports: {
    [localhost.id]: http(),
    // [sepolia.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId: '233ac368c45497f9220b43a293b10299'
    })
  ]
})