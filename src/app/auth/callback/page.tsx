"use client";

import React from "react";
import { useEffect } from "react";

import { useSearchParams, useRouter } from "next/navigation";
import { useUserContext } from "@/components/userProvider";

export default function page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const userProvider = useUserContext();
  useEffect(() => {
    if (code) {
      userProvider.startLoading();
      console.log(code);
      localStorage.setItem("accessCode", code);
      router.push("/account/info");
    }
  }, [code, router, userProvider]);

  return <div>{code}</div>;
}
