
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import {
  Button
} from "@/components/ui/button"

interface Package {
  name: string,
  description: string,
  version: string,
  downloads: number
}

async function getPackages(): Promise<Package[]> {
  const result = await fetch("http://localhost:4000/packages", { cache: 'no-cache'})
  const json = await result.json();
  return json;
}

export default async function Home() {
  const packages = await getPackages()
  
  return (
    <main>
      <div className="grid grid-cols-3 gap-8">
        {packages.map(_package => (
          <Card key={_package.name} className="flex flex-col justify-between">
            <CardHeader className="w-full">
              <div>
                <CardTitle>{_package.name}</CardTitle>
                <div className="flex justify-between">
                  <CardDescription>
                    v{_package.version}
                  </CardDescription>
                  <CardDescription>
                    {_package.downloads.toLocaleString()} downloads
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p>{_package.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary">View package</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}
