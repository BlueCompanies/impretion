"use client";

import { useState, useEffect } from "react";
import ShortUniqueId from "short-unique-id";
import { setCookie } from "cookies-next";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import CashPaymentModalWindow from "../CashPaymentModalWindow";
import PaymentTimer from "../PaymentTimer";
import { MdCancel } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import NotFoundPage from "../NotFoundPageModal";
import { getCookie } from "cookies-next";

export default function CashPaymentRequest() {
  const [paymentInProcess, setPaymentInProcess] = useState(false);
  const [showModalWindow, setShowModalWindow] = useState(false);
  const [paymentRequestAccepted, setPaymentRequestAccepted] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [isActiveSession, setIsActiveSession] = useState(true);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // User messages feedback
  const [paymentStatusMessage, setPaymentStatusMessage] = useState("");
  //const [countDown, setCountDown] = useState("");

  // Generates the API identifier so it can be manipulated by POST request i.e
  const uid = new ShortUniqueId({ length: 10 });
  const generatedId = uid.rnd();

  const payoutRequest = function () {
    //setCookie("payout", generatedId);
    if (generatedId) {
      setPaymentStatusMessage("");
      setPaymentInProcess(true);
      setIsCanceled(false);

      const params = new URLSearchParams(searchParams);
      console.log(generatedId);
      params.set("payoutId", generatedId);
      replace(`${pathname}?${params.toString()}`);

      const eventSource = new EventSource(
        `/api/shop-system/cash-payment-seller-processing/${generatedId}?shopRef=rNGfsGUXaJ5gqctXyDX5VB`
      );

      eventSource.addEventListener("statusMessage", (event) => {
        setPaymentStatusMessage(event.data);
      });

      eventSource.addEventListener("timer", (event) => {
        const eventData = event.data;
        //setCountDown(eventData);
      });

      // Cancelation by external things such as reloading the page.
      eventSource.addEventListener("cancel", () => {
        setIsCanceled(true);
        setTimeout(() => {
          setPaymentInProcess(false);
          setPaymentRequestAccepted(false);
          eventSource.close();
        }, 6000000);
        //setCountDown("");
        // state reset
      });

      eventSource.addEventListener("cancelByTimeout", (event) => {
        eventSource.close();
        setPaymentStatusMessage(
          "El tiempo limite de espera limite se ha excedido, el vendedor no ha dado respuesta a tu peticion"
        );
        setTimeout(() => {
          setPaymentInProcess(false);
        }, 3000);
        // setCountDown("");
        // state reset
        setPaymentRequestAccepted(false);
        setIsCanceled(true);
      });

      eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
        console.error("EventSource.readyState:", eventSource.readyState);
        console.error("EventSource.url:", eventSource.url);
        console.error(
          "EventSource.withCredentials:",
          eventSource.withCredentials
        );
        eventSource.close();
      };

      return {
        close: () => {
          console.info("Closing SSE");
          eventSource.close();
        },
      };
    }
  };

  useEffect(() => {
    if (paymentRequestAccepted) {
      payoutRequest();
    }
  }, [paymentRequestAccepted]);

  const modalWindowHandler = () => {
    setShowModalWindow(!showModalWindow);
  };

  useEffect(() => {
    // Apply overflow hidden to the body when payment process is active
    if (paymentInProcess) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = ""; // Revert to default when payment process is not active
    }

    // Clean up function to remove overflow hidden when component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [paymentInProcess]);

  return (
    <div style={{ width: "100%", margin: "10px" }}>
      {isActiveSession ? (
        <>
          {paymentInProcess && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "#fff",
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <PaymentTimer isCanceled={isCanceled} />
                </div>
                {paymentStatusMessage.length > 0 ? (
                  <div
                    style={{
                      marginTop: "15px",
                      color: isCanceled ? "#EE1D52" : "#1DEE4B",
                      display: "flex",
                    }}
                  >
                    <div style={{ width: "20px" }}>
                      <MdCancel />
                    </div>
                    <div>
                      <p>{paymentStatusMessage}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: "15px",
                      color: "#555",
                      fontSize: "17px",
                      display: "flex",
                    }}
                  >
                    <div style={{ width: "20px" }}>
                      <FaClock />
                    </div>
                    <div>
                      <p>Esperando que el cliente acepte tu pago.</p>
                    </div>
                  </div>
                )}
                <div
                  style={{
                    margin: "auto",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "5px",
                  }}
                >
                  <p style={{ color: "#555" }}>
                    Código de cliente -{" "}
                    {searchParams.get("payoutId") &&
                      searchParams.get("payoutId").toLocaleLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column" }}>
            <button
              onClick={modalWindowHandler}
              style={{
                width: "100%",
                padding: "6px",
                borderRadius: "4px",
                outline: "none",
                border: "none",
                background: "#fff",
                color: "#555",
              }}
            >
              Solicitar pago en efectivo
            </button>

            <button
              onClick={modalWindowHandler}
              style={{
                width: "100%",
                padding: "6px",
                borderRadius: "4px",
                outline: "none",
                border: "none",
                background: "#fff",
                color: "#555",
                margin: "5px",
              }}
            >
              Pagar después por transferencia
            </button>
          </div>

          {showModalWindow && (
            <CashPaymentModalWindow
              setShowModalWindow={setShowModalWindow}
              setPaymentRequestAccepted={setPaymentRequestAccepted}
            />
          )}
        </>
      ) : (
        <NotFoundPage />
      )}
    </div>
  );
}
