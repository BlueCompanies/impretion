"use client";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";
//import GoogleIcon from "./GoogleIcon";

export default function AuthForm({ session }) {
  console.log(session);
  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div>
      {!session && (
        <>
          <img src="/logo.png" alt="auth.js logo" />
          <h1>Welcome</h1>
          <p>Log in to continue to Next Auth Example</p>

          <div>
            <div />
            <span>OR</span>
            <div />
          </div>

          <button onClick={handleGoogleSignIn}>Continue with Google</button>
        </>
      )}

      {session && (
        <div>
          <img src="/logo.png" alt="auth.js logo" />
          <button onClick={handleSignOut}>Sign out</button>
        </div>
      )}
    </div>
  );
}
