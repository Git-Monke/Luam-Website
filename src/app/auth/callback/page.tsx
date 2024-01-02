"use client"

import React from 'react'

import { useSearchParams, useRouter } from 'next/navigation';

export default function page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code")

    if (code) {
        localStorage.setItem("accessCode", code)
    }

    router.push("http://localhost:3000/account/info")

    return (
        <div>{code}</div>
    )
}
