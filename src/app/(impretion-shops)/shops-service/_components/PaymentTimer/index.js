import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const PaymentTimer = ({ paymentStatus }) => {
  console.log("¡¡_ ", paymentStatus);
  const customChildren = ({ remainingTime }) => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "42px",
            fontWeight: "bold",
            fontFamily: "sans-serif",
            color:
              paymentStatus !== ""
                ? paymentStatus === "accepted"
                  ? "green"
                  : "red"
                : "#8C52FF",
          }}
        >
          <span style={{ margin: "0 5px" }}>
            {minutes < 10 ? `0${minutes}` : minutes}
          </span>
          <span>:</span>
          <span style={{ margin: "0 5px" }}>
            {seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CountdownCircleTimer
        isPlaying={paymentStatus !== "" ? false : true}
        duration={300}
        colors={
          paymentStatus !== ""
            ? paymentStatus === "accepted"
              ? "green"
              : "red"
            : "#8C52FF"
        }
        size={250}
        strokeWidth={18}
        strokeLinecap={"butt"}
        trailColor={"#dedede"}
      >
        {customChildren}
      </CountdownCircleTimer>
    </div>
  );
};

export default PaymentTimer;
