"use client"

import { signIn } from "next-auth/react"

export default function Page() {
    const handleLogin = async() => {
        await signIn("google", {callbackUrl:"/profile"})
    }

    return (
    <div style={{display:"flex", justifyContent:"center", alignItems:"center", background:"skyblue", flexDirection:"column"}}>
       Aqui ira la explicacion de los socios
       <button onClick={handleLogin}>Log con google</button>
    </div>
)
}