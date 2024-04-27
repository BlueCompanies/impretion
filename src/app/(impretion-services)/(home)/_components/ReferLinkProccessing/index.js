"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReferLinkProccessing() {
  const [message, setMessage] = useState(false);
  const searchParams = useSearchParams();
  const refId = searchParams.get("ref");
  useEffect(() => {
    // gets ref param from the url
    if (refId) {
      localStorage.setItem("refId", refId);
      setMessage(
        "¡Tienes descuentos al comprar cualquier producto ya que entraste con un link especial!"
      );
      setTimeout(() => {
        setMessage("");
      }, 3500);
    }
  }, [searchParams]);

  return (
    <>
      {refId && message.length > 0 && (
        <div
          style={{
            position: "fixed",
            background: "red",
            padding: "10px",
            borderRadius: "0px 0px 8px 0px",
            zIndex: 999,
          }}
        >
          {message}
          <button onClick={() => setMessage("")}>x</button>
        </div>
      )}
    </>
  );
}
