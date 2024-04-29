"use client";

import { useState } from "react";
import ModalMessage from "../../ModalMessage";

export default function DenyPayment({
  payoutId,
  expirationDateInMilliseconds,
}) {
  const [showModalWindow, setShowModalWindow] = useState(false);

  const denyPaymentHandler = async () => {
    const currentDate = new Date().getTime();

    // if link has expired and no refresh page, send error message activating the message modal window.
    if (currentDate > expirationDateInMilliseconds) {
      setShowModalWindow(true);
    } else {
      await fetch(
        `http://localhost:3000/api/shop-system/cash-payment-seller-processing/${payoutId}`,
        {
          method: "POST",
          headers: {
            ContentType: "application/json",
          },
          body: JSON.stringify({ payoutStatus: "deny" }),
        }
      );
    }
  };

  return (
    <>
      {showModalWindow && (
        <ModalMessage>
          No puedes denegar este pago porque el link ha vencido!
        </ModalMessage>
      )}
      <button
        onClick={denyPaymentHandler}
        style={{
          width: "100%",
          margin: "10px",
          outline: "none",
          border: "none",
          background: "#EE1D52",
          borderRadius: "4px",
          color: "#520015",
          fontWeight: 700,
        }}
      >
        DENEGAR
      </button>
    </>
  );
}
