import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function useAddress() {
  const [isClient, setIsClient] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? address : undefined;
}