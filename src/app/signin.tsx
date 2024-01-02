"use client";

import React from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { useUserContext } from "@/components/userProvider";

import { Skeleton } from "@/components/ui/skeleton";

const CLIENT_ID = "c646c8207bf56344f8d5";
const SIGNIN_URL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`;

export default function SignIn() {
  const userContext = useUserContext();

  return userContext.loading ? (
    <div className="flex flex-row gap-4 items-center">
      <Skeleton className="w-10 h-10 rounded-full"></Skeleton>
      <Skeleton className="w-20 h-5"></Skeleton>
    </div>
  ) : !userContext.userData ? (
    <Button className="bg-githubBg" asChild>
      <Link href={SIGNIN_URL}>
        <Github className="mr-2 h-5 w-5"></Github>
        Sign in
      </Link>
    </Button>
  ) : (
    <div className="flex">
      <Avatar>
        <AvatarImage src={userContext.userData.AvatarUrl}></AvatarImage>
        <AvatarFallback>
          {userContext.userData.Name
            ? userContext.userData.Name.slice(0, 1)
            : "Us"}
        </AvatarFallback>
      </Avatar>
      <Button variant="link">
        <Link href="/account/info" className="text-lg">
          {userContext.userData.Name}
        </Link>
      </Button>
    </div>
  );
}
