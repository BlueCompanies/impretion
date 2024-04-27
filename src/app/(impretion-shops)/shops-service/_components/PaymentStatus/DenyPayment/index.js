"use client";
export default function DenyPayment({ payoutId }) {
  const denyPaymentHandler = async () => {
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
  };

  return (
    <>
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
