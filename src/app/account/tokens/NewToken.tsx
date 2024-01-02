"use client";

import React from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Info } from "lucide-react";

import { toast } from "sonner";

const NewToken: React.FC<{
  open: boolean;
  onOpenChangeState: (open: boolean) => void;
  code: string;
}> = ({ open, code, onOpenChangeState }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChangeState}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Your New Token</DialogTitle>
        </DialogHeader>

        <div className="flex items-center">
          <Input
            readOnly
            value={code}
            className="rounded-tr-none rounded-br-none"
          />
          <Button
            onClick={() => {
              toast("Copied to clipboard");

              navigator.clipboard.writeText(code);
            }}
            className="rounded-tl-none rounded-bl-none"
          >
            <Copy></Copy>
          </Button>
        </div>

        <p>
          You can now run "luam login {"<token>"}" to interact with the
          registry!
        </p>

        <p className="text-red-500 flex gap-2">
          <Info className="text-red-500 w-7 h-7" /> You cannot recover this
          token once this dialog is closed. Copy it, and store it where you will
          not lose it.
        </p>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewToken;
