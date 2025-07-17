'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2Icon } from "lucide-react"
import { useContract } from '@/contexts/contract-context';

interface MintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function MintModal({ open, onOpenChange }: MintModalProps) {
  const { mintNFT } = useContract();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    price: "",
    image: '',
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    const fileData = new FormData();
    fileData.append("file", file);

    let response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
      },
      body: fileData,
    });
    response = await response.json();

    const fileUrl = `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`;
    setFormData((prev) => ({ ...prev, image: fileUrl }));
  }

  const onListNFT = async () => {
    setIsLoading(true);
    try {
      await mintNFT(formData);
      onOpenChange(false);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mint New NFT</DialogTitle>
        </DialogHeader>

        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">NFT Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="number">NFT Number</Label>
            <Input
              id="number"
              value={formData.number}
              onChange={e => setFormData((prev) => ({ ...prev, number: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">NFT Price(ETH)</Label>
            <Input
              id="price"
              type="number"
              step="0.001"
              value={formData.price}
              onChange={e => setFormData((prev) => ({ ...prev, price: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">NFT Image</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-cente">
              {formData.image ? (
                <div className="relative">
                  <img
                    src={formData.image}
                    alt="preview"
                    className="max-w-full h-32 object-cover mx-auto rounded"
                  />
                  <Button variant="destructive" size="sm" className="absolute -top-2 -right-2" onClick={() => {
                    setFormData((prev) => ({ ...prev, image: '' }))
                  }}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">Click to upload or drag and drop</p>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required
                  />
                  <Button asChild variant="outline">
                    <Label htmlFor="image">
                      Choose File
                    </Label>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="flex items-center space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
            className="flex-1"
            onClick={onListNFT}
          >
            {isLoading && <Loader2Icon className="animate-spin" />}
            Mint MFT
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}