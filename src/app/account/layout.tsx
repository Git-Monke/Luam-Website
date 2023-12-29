import {
    Button
} from "@/components/ui/button"

export default function RootLayout({
   children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <h1 className="p-4 rounded-lg my-12">Account Settings</h1>
            <div className="flex flex-row">
                <div className="flex flex-col gap-4 mr-12">
                    <Button variant="outline">Account</Button>
                    <Button variant="outline">API Tokens</Button>
                </div>
                {children}
            </div>
        </div>
        
    )
}