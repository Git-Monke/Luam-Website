"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import ConfirmDeactivation from "./ConfirmDeactivation";
import CreateToken from "./CreateToken";

import { useState, useEffect, useCallback } from "react";

import { useUserContext } from "@/components/userProvider";
import { Skeleton } from "@/components/ui/skeleton";

import NewToken from "./NewToken";
import { toast } from "sonner";

enum Scope {
  publish_update = "publish-update",
  publish_new = "publish-new",
  change_owners = "change-owners",
  yank = "yank",
}

type Scopes = {
  [key in Scope]: boolean;
};

type Token = {
  UserID: number;
  TokenIDHash: string;
  AllowedUses: number;
  CreatedAt: number;
  ExpirationDate: number;
  PackageNamePattern: string;
  Scopes: Scopes;
  Uses: number;
  Valid: boolean;
  Name: string;
};

function unixToDateString(unix: number): string {
  return new Date(unix).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatArray(array: any[]): JSX.Element[] {
  if (array.length === 1) {
    return [<strong>{array[0]}</strong>];
  }

  if (array.length === 2) {
    return [
      <strong>{array[0]}</strong>,
      <span> and </span>,
      <strong>{array[1]}</strong>,
    ];
  }

  return array
    .slice(0, array.length - 1)
    .map((item) => <strong>{item}, </strong>)
    .concat([<span>and </span>, <strong>{array[array.length - 1]}</strong>]);
}

const oneSecond = 1000;
const oneMinute = oneSecond * 60;
const oneHour = oneMinute * 60;
const oneDay = oneHour * 24;

function conditionalS(value: number): string {
  return value > 1 ? "s" : "";
}

function formatDateDistance(dist: number): string {
  if (dist < oneMinute) {
    const seconds = Math.floor(dist / oneSecond);
    return `${seconds} second${conditionalS(seconds)}`;
  }
  if (dist < oneHour) {
    const minutes = Math.floor(dist / oneMinute);
    return `${minutes} minute${conditionalS(minutes)}`;
  }
  if (dist < oneDay) {
    const hours = Math.floor(dist / oneHour);
    return `${hours} hour${conditionalS(hours)}`;
  }
  const days = Math.floor(dist / oneDay);
  return `${days} day${conditionalS(days)}`;
}

function hexToBase64(hexString: string) {
  const binaryString = Buffer.from(hexString, "hex").toString("binary");
  return Buffer.from(binaryString, "binary").toString("base64");
}

export default function Tokens() {
  if (typeof window !== undefined) {
    const user = useUserContext();
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState(false);

    const [newTokenOpen, setNewTokenOpen] = useState(false);
    const [newToken, setNewToken] = useState<string>("");

    useEffect(() => {
      if (!user.userData) {
        return;
      }

      function fetchTokens(auth: string): Promise<{ Items: Token[] }> {
        return fetch(
          "https://g06vvsjan9.execute-api.us-west-2.amazonaws.com/main/tokens",
          {
            next: {
              revalidate: 60,
            },
            headers: {
              Authorization: auth,
            },
            cache: "force-cache",
          }
        ).then((res) => res.json());
      }

      setLoading(true);
      fetchTokens(user.userData.Auth)
        .then((result) => {
          setTokens((result.Items as Token[]) || []);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }, [user]);

    const invalidateToken = (tokenIDHash: string) => {
      const updatedTokens = tokens.map((token) => {
        if (token.TokenIDHash === tokenIDHash) {
          return { ...token, Valid: false };
        }
        return token;
      });

      setTokens(updatedTokens);
    };

    const newTokenHandler = (json: { token: string; tokenData: Token }) => {
      setTokens([...tokens, json.tokenData]);
      setNewToken(json.token);
      setNewTokenOpen(true);
    };

    if (!user || !user.userData) {
      return (
        <div>
          <div className="flex justify-between">
            <h2>API Tokens</h2>
          </div>
          <Separator></Separator>
          <h3 className="ml-12 mt-12">
            Sign in with GitHub to view api tokens
          </h3>
        </div>
      );
    }

    if (loading) {
      return (
        <div>
          <div className="flex justify-between">
            <h2>API Tokens</h2>
          </div>
          <Separator></Separator>
          <div className="my-12 grid grid-cols-2 gap-8 w-full">
            {[1, 2, 3, 4].map((_, i) => {
              return (
                <Card key={i} className={`flex flex-col`}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-8 w-1/2"></Skeleton>
                    <Skeleton className="h-5 w-[300px]"></Skeleton>
                  </CardHeader>
                  <CardContent className="h-full flex flex-col justify-between">
                    <Skeleton className="h-8 w-20"></Skeleton>
                    <div>
                      <Skeleton></Skeleton>
                      <Skeleton></Skeleton>
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Skeleton></Skeleton>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="">
        <NewToken
          open={newTokenOpen}
          code={newToken}
          onOpenChangeState={setNewTokenOpen}
        ></NewToken>
        <div className="flex justify-between">
          <h2>API Tokens</h2>
          <CreateToken onTokenCreation={newTokenHandler}></CreateToken>
        </div>
        <Separator></Separator>

        <div className="my-12 grid grid-cols-2 gap-8 min-w-full">
          {tokens
            .sort((a, b) => b.CreatedAt - a.CreatedAt)
            .map((token, i) => {
              const expiryDistance = token.ExpirationDate - Date.now();
              const valid =
                token.Valid &&
                (token.ExpirationDate === 0 ||
                  (token.ExpirationDate !== 0 && expiryDistance > 0));

              return (
                <Card
                  key={i}
                  className={`opacity-${valid ? 100 : 50} flex flex-col`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle>{token.Name || "Unnamed"}</CardTitle>
                    <CardDescription className="truncate">
                      {hexToBase64(token.TokenIDHash)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-full flex flex-col justify-between">
                    <p>
                      Scopes:{" "}
                      {formatArray(
                        Object.keys(token.Scopes).filter(
                          (key) => token.Scopes[key as Scope]
                        )
                      )}
                    </p>
                    <div>
                      <p className="opacity-30">
                        Created {unixToDateString(token.CreatedAt)}
                      </p>
                      {!valid ? (
                        <p className="opacity-30">Expired</p>
                      ) : (
                        <p className="opacity-30">
                          {token.ExpirationDate !== 0
                            ? `Expires in ${formatDateDistance(expiryDistance)}`
                            : `Never expires`}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    {valid && (
                      <ConfirmDeactivation
                        onDialogAction={() => {
                          toast(`${token.Name} is now being deactivated`);
                          fetch("https://api.luam.dev/tokens", {
                            headers: {
                              Authorization: user.userData!.Auth,
                              TokenIDHash: token.TokenIDHash,
                            },
                            method: "DELETE",
                          }).then((res) => {
                            if (res.status !== 200) {
                              res.json().then((body) => {
                                toast(
                                  "An error occured while deactivating token",
                                  {
                                    description: body.message,
                                  }
                                );
                              });
                            } else {
                              toast(
                                `${token.Name} has been successfully deactivated`
                              );
                              invalidateToken(token.TokenIDHash);
                            }
                          });
                        }}
                      ></ConfirmDeactivation>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          {tokens.length === 0 ? (
            <p>You currently have no API tokens</p>
          ) : undefined}
        </div>
      </div>
    );
  }
}
