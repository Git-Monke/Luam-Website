import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import {
    Separator
} from "@/components/ui/separator"

import ConfirmDeactivation from "./ConfirmDeactivation"
import CreateToken from "./CreateToken"


interface Token {
    name: string,
    scopes: string[],
    creationDate: number,
    valid: boolean,
    id: string,
    validUntil: number
}

async function fetchTokens(): Promise<Token[]> {
    let result = await fetch("http://localhost:4000/tokens", {cache: 'no-cache'})
    return result.json()
}

function unixToDateString(unix: number): string {
    return new Date(unix).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function formatArray(array: any[]): JSX.Element[] {
    if (array.length === 1) {
        return [<strong>
                {array[0]}
            </strong>]
        
    }

    if (array.length === 2) {
        return [
            <strong>
                {array[0]}
            </strong>,
            <span>{' '}and{' '}</span>,
            <strong>
                {array[1]}
            </strong>
        ]
    }

    return  array.slice(0, array.length - 1).map(item => (
            <strong>{item}, </strong>
        )).concat([
           <span>and{' '}</span> ,
           <strong>{array[array.length - 1]}</strong>
        ])
}

const oneSecond = 1000
const oneMinute = oneSecond * 60
const oneHour = oneMinute * 60;
const oneDay = oneHour * 24;

function conditionalS(value: number): string {
    return value > 1 ? 's' : ''
}

function formatDateDistance(dist: number): string {
    if (dist < oneMinute) {
        const seconds = Math.floor(dist / oneSecond)
        return `${seconds} second${conditionalS(seconds)}`
    }
    if (dist < oneHour){ 
        const minutes = Math.floor(dist / oneMinute)
        return `${minutes} minute${conditionalS(minutes)}`
    }
    if (dist < oneDay) {
        const hours = Math.floor(dist / oneHour)
        return `${hours} hour${conditionalS(hours)}`
    }
    const days = Math.floor(dist / oneDay)
    return `${days} day${conditionalS(days)}`
}


export default async function Tokens() {
    const tokens = await fetchTokens()

    return (
        <div>
            <div className="flex justify-between">
                <h2>API Tokens</h2>
                <CreateToken></CreateToken>
            </div>
            <Separator></Separator>

            <div className="my-12 grid grid-cols-2 gap-8">
                {tokens.map((token, i) => {
                    const expiryDistance = token.validUntil - Date.now()
                    const valid = token.valid && (expiryDistance > 0)
                    
                    return (
                        <Card key={i} className={`opacity-${valid ? 100 : 50} flex flex-col`}>
                            <CardHeader className="pb-2">
                                <CardTitle>{token.name}</CardTitle>
                                <CardDescription>{token.id}</CardDescription>
                            </CardHeader>
                            <CardContent className="h-full flex flex-col justify-between">
                                <p>Scopes: {formatArray(token.scopes)}</p>
                                <div>
                                <p className="opacity-30">Created {unixToDateString(token.creationDate)}</p>
                                {!valid ? <p className="opacity-30">Expired</p> : <p className="opacity-30">Expires in {formatDateDistance(expiryDistance)}</p>}
                                </div>
                            </CardContent>
                            <CardFooter className="mt-auto">
                                {valid && <ConfirmDeactivation></ConfirmDeactivation>}
                            </CardFooter>
                        </Card>
                    )})}
            </div>
            
        </div>
    )
}