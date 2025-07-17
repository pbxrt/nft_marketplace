import { http, createConfig } from 'wagmi'
import {
  sepolia,
  localhost
} from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors';

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
  chains: [localhost],
  transports: {
    [localhost.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId: '233ac368c45497f9220b43a293b10299'
    })
  ]
});

