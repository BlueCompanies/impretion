"use client";
import { getUser } from "@/app/_lib/userProfiles";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DiscountCode() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState();

  useEffect(() => {
    if (session) {
      const { user } = session;
      (async () => {
        const userByEmail = await getUser(user.email);
        const { document } = userByEmail;
        console.log("six9 ", document);
        setUserData(document);
      })();
    }
  }, [session]);

  const handleCodeRemover = () => {
    try {
      localStorage.removeItem("refId");
    } catch (error) {
      // Handle any potential errors, such as if localStorage is not supported
      console.error("Error removing item from localStorage:", error);
    }
  };

  return (
    <>
      {userData && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "4px",
            border: "1px solid #e2e2e2",
            padding: "1px",
            borderRadius: "3px",
          }}
        >
          <span
            style={{
              background: "#e2e2e2",
              padding: "4px",
              color: "#333",
              minWidth: "200px",
            }}
          >
            Codigo de descuento
          </span>
          <input
            type="text"
            style={{
              margin: "0px 2px 0px 4px",
              color: "#000",
              fontWeight: 700,
              width: "100%",
              fontSize: "16px",
              border: userData?.affiliateData.affiliateId.enabled
                ? "1px solid #dedede"
                : "1px solid #D40D00",
              padding: "2px",
              outline: "none",
            }}
            defaultValue={userData?.affiliateData.affiliateId.id}
          ></input>
          <div
            style={{
              background: userData?.affiliateData.affiliateId.enabled
                ? "#00B8D1"
                : "#D40D00",
              height: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
              width: "700px",
              color: "#fff",
            }}
          >
            {userData?.affiliateData.affiliateId.enabled ? (
              <p>Tienes un descuento del 10%</p>
            ) : (
              <p>Este codigo ya no es valido</p>
            )}
            {!userData?.affiliateData.affiliateId.enabled && (
              <button
                style={{
                  outline: "none",
                  border: "none",
                  borderRadius: "2px",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
                onClick={handleCodeRemover}
              >
                Remover
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
