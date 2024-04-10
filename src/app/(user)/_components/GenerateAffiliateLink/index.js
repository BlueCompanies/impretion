"use client";

import { getUser } from "@/app/_lib/userProfiles";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ShortUniqueId from "short-unique-id";

export default function GenerateAffiliateLink() {
  const [affiliateId, setAffiliateId] = useState("");
  const [error, setError] = useState("");
  const session = useSession();
  const [idValidatorLoader, setIdValidatorLoader] = useState(false);
  const [userDataLoader, setUserDataLoader] = useState();

  const linkGenerator = async () => {
    setIdValidatorLoader(true);
    const id = new ShortUniqueId({ length: 10 });
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
      setIdValidatorLoader(false);
      return;
    }
    setError("");
    setAffiliateId(data);
    setIdValidatorLoader(false);
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
        setAffiliateId(userDetails.affiliateId);
      }
      setUserDataLoader(false);
    })();
  }, [session]);

  return (
    <>
      <button onClick={linkGenerator}>
        {userDataLoader ? (
          <>Loading...</>
        ) : affiliateId ? (
          <>Haz generado tu link</>
        ) : (
          <>Generar link de afiliado</>
        )}
      </button>
      {!affiliateId && !idValidatorLoader ? (
        <>Loader...</>
      ) : (
        <p>impretion.com?ref={affiliateId}</p>
      )}
      {error.length > 0 && (
        <div
          style={{
            background: "red",
            margin: "10px 0px 10px 0px",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          <p>{error}</p>
        </div>
      )}
    </>
  );
}
