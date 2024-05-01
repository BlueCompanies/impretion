"use client";

import { MdSell } from "react-icons/md";

export default function AcceptAndProcessPaymentButton({
  setPaymentRequestAccepted,
  setShowSummaryPaymentModalWindow,
}) {
  return (
    <>
      <button
        onClick={() => {
          setPaymentRequestAccepted(true),
            setShowSummaryPaymentModalWindow(false);
        }}
        style={{
          borderRadius: "0px 0px 3px 3px",
          outline: "none",
          border: "none",
          height: "30px",
          outline: "none",
          background: "#5271FF",
          color: "#fff",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MdSell style={{ marginRight: "5px", fontSize: "16px" }} />
        </div>
        Aceptar y procesar
      </button>
    </>
  );
}
