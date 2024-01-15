"use client";

import React from "react";

import { useSearchParams, useRouter } from "next/navigation";
import { useUserContext } from "@/components/userProvider";

export default function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const userProvider = useUserContext();

  if (code) {
    userProvider.startLoading();
    localStorage.setItem("accessCode", code);
  }

  router.push("http://localhost:3000/account/info");

  return <div>{code}</div>;
}
