"use client"

import { signIn } from "next-auth/react"
export const runtime = "edge";

export default function Page() {
    const handleLogin = async() => {
        await signIn("google", {callbackUrl:"/profile"})
    }

    return (
    <div style={{display:"flex", justifyContent:"center", alignItems:"center", background:"skyblue", flexDirection:"column"}}>
       <button onClick={handleLogin}>Log in con google</button>
    </div>
)
}