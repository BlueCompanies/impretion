"use client";

import { getUser } from "@/app/_lib/userProfiles";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ShortUniqueId from "short-unique-id";
import { GrStatusGood } from "react-icons/gr";
import { IoIosLink } from "react-icons/io";
import BasicLoader from "@/app/_components/Loaders/Loader";

const GENERATED_LINK_TEXT = "Enlace generado";
const GENERATE_LINK_TEXT = "Generar Enlace";

export default function GenerateAffiliateLink() {
  const [affiliateId, setAffiliateId] = useState("");
  const [error, setError] = useState("");
  const session = useSession();
  const [buttonMessage, setButtonMessage] = useState("");
  const [userDataLoader, setUserDataLoader] = useState(false);

  const linkGenerator = async () => {
    const id = new ShortUniqueId({ length: 6, dictionary: "alphanum_lower" });
    const generatedId = id.rnd();
    const response = await fetch("/api/user/affiliate-id-validator", {
      method: "POST",
      headers: {
        ContentType: "application/json",
      },
      body: JSON.stringify(generatedId),
    });
    console.log(response);
    const { data } = await response.json();

    if (response.status === 409) {
      setError(data);
      return;
    }
    setError("");
    setAffiliateId(data);
  };

  useEffect(() => {
    (async () => {
      if (session.status === "authenticated") {
        setUserDataLoader(true);
        const { data } = session;
        const { user } = data;
        const getUserFromDB = async () => {
          const { document } = await getUser(user.email);
          return document;
        };
        const userDetails = await getUserFromDB();
        setAffiliateId(userDetails.affiliateData?.affiliateId);
        console.log(userDetails.affiliateData?.affiliateId);
        setButtonMessage(
          userDetails.affiliateData?.affiliateId
            ? GENERATED_LINK_TEXT
            : GENERATE_LINK_TEXT
        );
      }
      setUserDataLoader(false);
    })();
  }, [session, buttonMessage, affiliateId]);

  return (
    <div
      style={{
        padding: "10px",
        borderRadius: "6px",
        margin: "10px",
        minHeight: "80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {userDataLoader ? (
        <img src="/loaders/basic-loader.webp" style={{ width: "60px" }}></img>
      ) : (
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {buttonMessage.length > 0 && (
            <div
              onClick={
                buttonMessage === GENERATE_LINK_TEXT ? linkGenerator : null
              }
              disabled={buttonMessage === GENERATED_LINK_TEXT && true}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "20px",
              }}
            >
              <p
                style={{
                  fontSize:
                    buttonMessage === GENERATE_LINK_TEXT ? "26px" : "16px",
                  marginRight: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: buttonMessage === GENERATE_LINK_TEXT && "pointer",
                }}
              >
                {buttonMessage}
                {buttonMessage === GENERATE_LINK_TEXT && (
                  <IoIosLink style={{ fontSize: "26px", marginLeft: "10px" }} />
                )}
              </p>
              {buttonMessage === GENERATED_LINK_TEXT && (
                <GrStatusGood style={{ height: "100%", color: "#24D100" }} />
              )}
            </div>
          )}

          {affiliateId && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IoIosLink style={{ fontSize: "18px" }} />
              <p style={{ fontSize: "18px", margin: "5px" }}>
                impretion.com?ref={affiliateId}
              </p>
            </div>
          )}
        </div>
      )}

      {error.length > 0 && (
        <div
          style={{
            color: "red",
            margin: "10px 0px 10px 0px",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
