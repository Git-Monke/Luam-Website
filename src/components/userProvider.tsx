"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface UserData {
  UserID: number;
  Login: string;
  AvatarUrl: string;
  HtmlUrl: string;
  Name: string;
  Auth: string;
}

interface UserContext {
  userData: UserData | null;
  loading: boolean;
  signIn: Function;
  signOut: Function;
  startLoading: Function;
  stopLoading: Function;
}

const UserContext = createContext<UserContext | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("User context must be wrapped in a UserProvider");
  }

  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const accessToken = localStorage.getItem("authToken");

  const [userData, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (accessToken && !userData) {
    fetch(`https://api.github.com/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: 60,
      },
    })
      .then((req) => req.json())
      .then((body) => {
        setUser({
          UserID: body.id,
          Login: body.login,
          AvatarUrl: body.avatar_url,
          HtmlUrl: body.html_url,
          Name: body.name,
          Auth: `Bearer ${accessToken}`,
        });
      });
  }

  const signIn = (userData: UserData) => {
    setUser(userData);
    setLoading(false);
  };

  const signOut = () => {
    setUser(null);
  };

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  return (
    <UserContext.Provider
      value={{ userData, loading, signIn, signOut, startLoading, stopLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};
