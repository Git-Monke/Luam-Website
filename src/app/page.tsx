import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-8 mt-24">
      <h1 className="text-center mt-15">Get Started Now</h1>
      <p className="text-center">Simply run</p>
      <code className="bg-gray-100 m-4 p-4 rounded-lg">
        {`
          pastebin run 1whQ98XJ
        `}
      </code>
      <p>In your ComputerCraft computer</p>
    </main>
  );
}
