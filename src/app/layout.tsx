import type { Metadata } from "next";
import "./globals.css";

import SignIn from "./signin";

import { UserProvider } from "@/components/userProvider";

import React from "react";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
              <h1>Luam</h1>
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
