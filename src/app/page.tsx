import { Separator } from "@/components/ui/separator";

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-8 mt-24">
      <h1 className="text-center mt-15">Get Started Now</h1>
      <h3 className="text-center">Simply run</h3>
      <code className="bg-gray-100 p-4 rounded-lg">
        {`
          pastebin run 1whQ98XJ
        `}
      </code>
      <h3>In your ComputerCraft computer</h3>
      <h3>Then</h3>
      <div className="flex gap-16 justify-between w-full">
        <div className="flex flex-col items-center gap-8 w-full">
          <div className="flex flex-col items-center">
            <p>Join the discord to discover new packages</p>
            <p>and grow the community</p>
          </div>
          <iframe
            src="https://discord.com/widget?id=1181348347282456596&theme=dark"
            width="350"
            height="500"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          ></iframe>
        </div>
        <h2 className="flex items-center">OR</h2>
        <div className="flex flex-col items-center gap-8 w-full max-w-none">
          <div className="flex flex-col items-center">
            <p>Run the help command to learn</p>
            <p>how to use the tool</p>
          </div>
          <code className="bg-gray-100 m-4 p-4 rounded-lg">
            {`
        luam help
        `}
          </code>
        </div>
      </div>
    </main>
  );
}
