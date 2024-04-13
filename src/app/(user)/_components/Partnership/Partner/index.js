"use client";
import { useState } from "react";
import GenerateAffiliateLink from "../GenerateAffiliateLink";
import { IoIosWarning } from "react-icons/io";
import { getUser } from "@/app/_lib/userProfiles";
import { FaCopy, FaPhoneAlt, FaWallet } from "react-icons/fa";
import ShortUniqueId from "short-unique-id";
import { RiMessage2Fill } from "react-icons/ri";
import { GrStatusGood } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";

export default function Partner({ user }) {
  const [error, setError] = useState("");

  const handleWithdraw = () => {
    if (user.affiliateData.wallet === 0) {
      setError("No tienes dinero para retirar.");
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          width: "100%",
          overflow: "auto",
          margin: "20px",
          height: "85%",
          borderRadius: "6px",
          padding: "10px",
        }}
      >
        <div
          style={{
            background: "100%",
            height: "30px",
            backgroundColor: "#1A83FF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "18px",
            color: "#fff",
            borderRadius: "6px 6px 0px 0px",
          }}
        >
          Bienvenido/a {user.name}
        </div>

        <div
          style={{
            border: "1px solid #1A83FF",
            display: "flex",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "4px",
            background: "#CFE5FF",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p>Este es tu enlace especial, compartelo para ganar dinero</p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "15px",
            }}
          >
            <p style={{ fontWeight: 700, color: "#555555" }}>
              https://impretion.com?ref={user.affiliateData.affiliateId}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "10px",
              }}
            >
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `https://impretion.com?ref=${user.affiliateData.affiliateId}`
                  )
                }
                style={{
                  border: "1px solid #555555",
                  outline: "none",
                  background: "#fff",
                  padding: "5px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                <FaCopy
                  style={{
                    fontSize: "16px",
                    color: "#555555",
                  }}
                />
              </button>
              <span style={{ fontSize: "10px" }}>Copiar</span>
            </div>
          </div>
        </div>

        <div
          style={{
            border: "1px solid #1A83FF",
            display: "flex",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "4px",
            background: "#CFE5FF",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaWallet style={{ marginRight: "10px" }} />
            <span>Tu billetera: </span>
            <span style={{ marginLeft: "5px" }}>
              {user.affiliateData.wallet} COP
            </span>
          </div>
          {user.affiliateData.wallet === 0 && (
            <div
              style={{
                marginTop: "5px",
                border: "1px solid #FFD51E",
                padding: "5px",
                background: "#FFF2BA",
                borderRadius: "4px",
                display: "flex",
                color: "#555555",
              }}
            >
              <p>Cada vez que alguien compre desde tu link ganaras dinero.</p>
            </div>
          )}
          <button
            style={{
              marginTop: "10px",
              padding: "5px",
              cursor: "pointer",
              background: "#1A83FF",
              border: "none",
              borderRadius: "4px",
              color: "#fff",
            }}
            onClick={handleWithdraw}
          >
            Retirar dinero
          </button>

          {error.length > 0 && (
            <div
              style={{
                background: "#FF4848",
                marginTop: "10px",
                padding: "5px",
                width: "100%",
                color: "#fff",
                borderRadius: "4px",
                display: "flex",
              }}
            >
              <IoIosWarning style={{ color: "#fff" }} />
              <p style={{ marginRight: "10px" }}>{error}</p>
            </div>
          )}
        </div>

        <div style={{ border: "1px solid #dedede", marginTop: "10px" }}></div>
      </div>
    </>
  );
}
