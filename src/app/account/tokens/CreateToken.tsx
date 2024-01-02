"use client";

import React, { useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Check, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { PermissionCheckbox } from "./PermissionCheckbox";
import { Button } from "@/components/ui/button";

import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

import { Calendar } from "@/components/ui/calendar";
import { useUserContext } from "@/components/userProvider";
import { DialogClose } from "@radix-ui/react-dialog";

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

const formSchema = zod
  .object({
    Name: zod
      .string()
      .regex(/^[A-Za-z0-9_-]*$/, "Only a-z, A-Z, 0-9, _, and - are allowed")
      .min(1, "Must be at least 1 character long"),
    Permissions: zod.array(zod.boolean()),
    PackageNamePattern: zod.string().optional(),
  })
  .refine(
    (data) => {
      return data.Permissions.some((item) => item);
    },
    {
      message: "At least one permission must be granted",
      path: ["Permissions"],
    }
  );

const TokenCreation: React.FC<{
  onTokenCreation: (json: { token: string; tokenData: Token }) => void;
}> = ({ onTokenCreation }) => {
  const [open, setOpen] = useState(false);

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      Permissions: [false, false, false, false],
      PackageNamePattern: "",
    },
  });

  const user = useUserContext();

  let alreadyCreatingToken = false;

  if (!user.userData || (user.userData && !user.userData.Auth)) {
    return;
  }

  const submitHandler = (data: zod.infer<typeof formSchema>) => {
    setOpen(false);

    if (alreadyCreatingToken) {
      toast("Another token is currently being created.", {
        description:
          "Please wait until the first token has been created to create another.",
      });
    }

    toast("Your token is being created", {
      description: "Do not close this tab or you will not recieve the token.",
    });

    alreadyCreatingToken = true;
    fetch(
      "https://g06vvsjan9.execute-api.us-west-2.amazonaws.com/main/tokens",
      {
        headers: {
          Authorization: user.userData!.Auth,
        },
        method: "POST",
        body: JSON.stringify({
          scopes: {
            "publish-new": data.Permissions[0],
            "publish-update": data.Permissions[1],
            "change-owners": data.Permissions[2],
            yank: data.Permissions[3],
          },
          name: data.Name,
          namePattern: data.PackageNamePattern,
        }),
      }
    )
      .then((res) => {
        alreadyCreatingToken = false;
        return res.json();
      })
      .then((json) => {
        return onTokenCreation(json);
      })
      .catch((err) => {
        toast("An error occured while creating the token.");
        alreadyCreatingToken = false;
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="mr-0">
        <Button>Create Token</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New API Token</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="flex flex-col gap-4"
          >
            <FormField
              name="Name"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Token Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Token Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              name="Permissions"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <FormControl>
                      <div>
                        {[
                          "publish-new",
                          "publish-update",
                          "change-owners",
                          "yank",
                        ].map((index, i) => (
                          <div key={index} className="flex flex-row gap-4">
                            <div className="flex flex-row items-center">
                              <Checkbox
                                id={index}
                                onCheckedChange={(e) => {
                                  let newBoxes = field.value;
                                  newBoxes[i] = e.valueOf() as boolean;
                                  field.onChange(newBoxes);
                                }}
                              />
                              <label
                                htmlFor={index}
                                className="ml-3 flex items-center h-full"
                              >
                                {index}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              name="PackageNamePattern"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Package Name Pattern</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Leave blank for no pattern"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <DialogFooter>
              <Button type="submit">Create Token</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TokenCreation;
