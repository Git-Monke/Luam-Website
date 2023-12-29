"use client"

import { Checkbox } from "@/components/ui/checkbox"

export function PermissionCheckbox({ children }: { children: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="permission" />
      <label
        htmlFor="permission"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {children}
      </label>
    </div>
  )
}
