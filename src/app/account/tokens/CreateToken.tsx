import React from 'react'

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import { Plus } from 'lucide-react';

import { Input } from '@/components/ui/input'
import { PermissionCheckbox } from "./PermissionCheckbox"
import { Button } from '@/components/ui/button'

export default function TokenCreation() {
  return (
    <Dialog>
        <DialogTrigger asChild className="mr-0">
            <Button>Create Token</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              New API Token
            </DialogTitle>
          </DialogHeader>

          <h3>Token Name</h3>
          <Input placeholder="Name"></Input>

          <h3>Lifetime</h3>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Never Expire" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="0">Never Expire</SelectItem>
              <SelectItem value="7">7 Days</SelectItem>
              <SelectItem value="30">1 Month</SelectItem>
              <SelectItem value="60">2 Months</SelectItem>
              <SelectItem value="90">3 Months</SelectItem>
              <SelectItem value="365">1 Year</SelectItem>
            </SelectContent>
          </Select>

          <h3>Permissions</h3>
          <PermissionCheckbox>publish-new</PermissionCheckbox>
          <PermissionCheckbox>publish-update</PermissionCheckbox>
          <PermissionCheckbox>change-owners</PermissionCheckbox>
          <PermissionCheckbox>yank</PermissionCheckbox>

          <h3>Package Name Pattern</h3>
          <Input placeholder='Pattern'></Input>

          <DialogFooter>
            <Button>Create Token</Button>
          </DialogFooter>
        </DialogContent>
        
    </Dialog>
  )
}
