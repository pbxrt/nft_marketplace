import { useChainId, useSwitchChain } from 'wagmi';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { watchAccount } from '@wagmi/core';
import { config } from '@/contexts/wagmiConfig';

export default function SwitchToValidChain() {
  const chainId = useChainId();
  const [walletChainId, setWalletChainId] = useState(null);
  const { chains, switchChain } = useSwitchChain();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    watchAccount(config, {
      onChange(data) {
        if (data.chainId) {
          setWalletChainId(data.chainId);
        }
      }
    })
  }, []);

  useEffect(() => {
    if (chainId && walletChainId) {
      setOpen(chainId !== walletChainId);
    }
  }, [chainId, walletChainId]);

  const handleSwitch = () => {
    switchChain({ chainId: chains[0].id });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unsupported Chain</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div>Please switch to （ID: {chains[0]?.id} to proceed.</div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSwitch}
          >
            Switch
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )


}