import type { Metadata } from "next";
import "./globals.css";

import SignIn from "./signin";

import { UserProvider } from "@/components/userProvider";

import React from "react";

import { Toaster } from "@/components/ui/sonner";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Luam",
  description: "A Minecraft computer package manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <UserProvider>
        <body>
          <nav>
            <div className="flex justify-between">
              <Link href="/">
                <h1>Luam</h1>
              </Link>
              <SignIn></SignIn>
            </div>
            {children}
          </nav>
          <Toaster />
        </body>
      </UserProvider>
    </html>
  );
}
