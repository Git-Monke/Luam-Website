import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="p-4 rounded-lg my-12">Account Settings</h1>
      <div className="flex flex-row">
        <div className="flex flex-col gap-4 mr-12">
          <Button variant="outline" asChild>
            <Link href="/account/info">Account</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/account/tokens">API Tokens</Link>
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
