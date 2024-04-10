"use client";

import { signOut } from "next-auth/react";

export default function Logout() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button
      style={{
        padding: "15px",
        outline: "none",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        border: "1px solid #dedede",
      }}
      onClick={handleSignOut}
    >
      Salir
    </button>
  );
}
