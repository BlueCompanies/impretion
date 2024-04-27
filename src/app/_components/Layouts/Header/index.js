import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { FaUserCircle } from "react-icons/fa";
import { signOut } from "next-auth/react";
import Logout from "./_components/Logout";

export default async function MainHeader() {
  const session = await auth();

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        height: "90px",
        background: "#fff",
        zIndex: 100,
        position: "fixed", // Change position to fixed
        top: 0, // Set top to 0 to stick at the top
        width: "100%", // Make the header full-width
        borderBottom: "2px solid #e9e9e9",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          margin: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <div style={{}}>
          <Link href="/" style={{ fontWeight: 800, fontSize: "32px" }}>
            impretion
          </Link>
        </div>

        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            right: 1,
            margin: "20px",
          }}
        >
          {session ? (
            <>
              <Link
                style={{
                  padding: "15px",
                  outline: "none",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  border: "1px solid #dedede",
                  margin: "10px",
                }}
                href="/profile"
              >
                <FaUserCircle />
                <span style={{ marginLeft: "8px" }}>Perfil</span>
              </Link>

              <Logout />
            </>
          ) : (
            <>
              <Link
                style={{
                  padding: "15px",
                  outline: "none",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  border: "1px solid #dedede",
                  margin: "10px",
                }}
                href="/partnership"
              >
                <FaStar />
                <span style={{ marginLeft: "8px" }}>Vuelvete socio</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
