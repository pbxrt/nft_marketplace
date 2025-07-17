import { useChainId, useSwitchChain } from 'wagmi';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function SwitchToValidChain() {
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!chainId) return;
    if (chains.every(chain => chain.id !== chainId)) {
      setOpen(true);
    }
  }, [chainId, chains]);

  const handleSwitch = () => {
    switchChain({ chainId: chains[0].id });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>hello</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div>请切换到目标链（ID: {chains[0]?.id}）以继续操作。</div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSwitch}
          >
            一键切换
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )


}