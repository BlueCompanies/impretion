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
      // this will ping the api with a post to deny the client transaction
      await fetch(
        `http://localhost:3000/api/shop-system/cash-payment-seller-processing/${payoutId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payoutStatus: "denied" }),
        }
      );
    }
  };

  return (
    <>
      {showModalWindow && (
        <ModalMessage>
          <p>
            No puedes denegar este pago porque el link ha vencido!, Por favor,
            pidele al cliente que vuelva a hacer la transacción.
          </p>
          <button
            onClick={() => window.close()}
            style={{
              marginTop: "10px",
              border: "none",
              padding: "10px",
              borderRadius: "4px",
              background: "red",
              color: "#fff",
            }}
          >
            Cerrar ventana
          </button>
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
