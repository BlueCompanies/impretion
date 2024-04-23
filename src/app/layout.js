"use client";

import { SessionProvider } from "next-auth/react";
import "./globals.css";

export default function MainLayout({
  params: { session, ...params },
  children,
}) {
  return (
    <html>
      <SessionProvider session={session}>
        <body
          style={
            params.section === "designs"
              ? { overflow: "hidden" }
              : { marginTop: "90px" }
          }
        >
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
