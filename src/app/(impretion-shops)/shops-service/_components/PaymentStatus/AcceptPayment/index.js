"use client";
export default function AcceptPayment() {
  const acceptPaymentHandler = () => {};

  return (
    <>
      <button
        onClick={acceptPaymentHandler}
        style={{
          width: "100%",
          margin: "10px",
          outline: "none",
          border: "none",
          borderRadius: "4px",
          color: "#00390D",
          background: "#1DEE4B",
          fontWeight: 700,
        }}
      >
        ACEPTAR
      </button>
    </>
  );
}
