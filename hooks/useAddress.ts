import { useEffect, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';

export default function useAddress() {
  const [isClient, setIsClient] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? address : undefined;
}

export function useChain() {
  const [isClient, setIsClient] = useState(false);
  const chainId = useChainId();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? chainId : undefined;
}