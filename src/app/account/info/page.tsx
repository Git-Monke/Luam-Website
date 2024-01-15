"use client";

import React from "react";

import { useEffect, useState, useRef } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";

import { useUserContext } from "@/components/userProvider";

interface UserResponseData {
  UserID: number;
  Login: string;
  AvatarUrl: string;
  HtmlUrl: string;
  Name: string;
}

const flexedSkeleton = (w: number) => {
  return (
    <div className="flex flex-col justify-end">
      <Skeleton className={`h-3/4 w-${w}`}></Skeleton>
    </div>
  );
};

export default function Page() {
  if (typeof window !== undefined) {
    const userContext = useUserContext();

    useEffect(() => {
      const accessCode = localStorage.getItem("accessCode");

      if (!accessCode) {
        return;
      }

      userContext.startLoading();
      try {
        fetch(
          "https://g06vvsjan9.execute-api.us-west-2.amazonaws.com/main/signup",
          {
            method: "POST",
            headers: {
              ["X-Code"]: accessCode,
            },
            cache: "default",
          }
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to load resources");
            }

            return res.json();
          })
          .then((body) => {
            if (body.access_token) {
              localStorage.setItem("authToken", body.access_token);
              localStorage.setItem("accessCode", "");

              const user_data = body.user_data as UserResponseData;
              userContext.signIn({
                ...user_data,
                Auth: `Bearer ${body.access_token}`,
              });
            }
          })
          .catch((err) => {
            userContext.stopLoading();
          });
      } catch (err) {
        console.log(err);
      }
    }, []);

    return userContext.loading ? (
      <div className="flex gap-12">
        <Skeleton className="w-[100px] h-[100px]"></Skeleton>
        <div className="grid grid-rows-3 grid-cols-2 gap-x-4 align-bottom">
          <p className="mr-12 w-full text-right font-semibold">Display Name</p>
          {flexedSkeleton(12)}
          <p className="mr-12 w-full text-right font-semibold">User Name</p>
          {flexedSkeleton(14)}
          <p className="mr-12 w-full text-right font-semibold">User ID</p>
          {flexedSkeleton(16)}
        </div>
      </div>
    ) : userContext.userData ? (
      <div>
        <div className="flex gap-12">
          <Image
            src={userContext.userData.AvatarUrl}
            alt="Profile"
            height={100}
            width={100}
          ></Image>
          <div className="grid grid-rows-3 grid-cols-2 gap-x-4">
            <p className="mr-12 w-full text-right font-semibold">
              Display Name
            </p>
            <p>{userContext.userData.Name}</p>
            <p className="mr-12 w-full text-right font-semibold">User Name</p>
            <p>{userContext.userData.Login}</p>
            <p className="mr-12 w-full text-right font-semibold">User ID</p>
            <p>{userContext.userData.UserID}</p>
          </div>
        </div>
      </div>
    ) : (
      <h3>Sign in with GitHub to view account information</h3>
    );
  }
}
