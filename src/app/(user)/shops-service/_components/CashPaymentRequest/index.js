"use client";

import { useState, useEffect } from "react";
import ShortUniqueId from "short-unique-id";
import { setCookie } from "cookies-next";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function CashPaymentRequest() {
  const [paymentInProcess, setPaymentInProcess] = useState(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // set query param to the current request, this occurs when the user calls the event source

  // User messages feedback
  const [paymentStatusMessage, setPaymentStatusMessage] = useState("");
  const [countDown, setCountDown] = useState("");

  // Generates the API identifier so it can be manipulated by POST request i.e
  const uid = new ShortUniqueId({ length: 10 });
  const generatedId = uid.rnd();

  const payoutRequest = function () {
    //setCookie("payout", generatedId);
    if (generatedId) {
      setPaymentStatusMessage("");
      setPaymentInProcess(true);

      const params = new URLSearchParams(searchParams);
      params.set("payoutId", generatedId);
      replace(`${pathname}?${params.toString()}`);

      const eventSource = new EventSource(
        `/api/shop-system/cash-payment-seller-processing?payoutId=${generatedId}`
      );

      eventSource.onmessage = (event) => {};

      eventSource.addEventListener("timer", (event) => {
        const eventData = event.data;
        setCountDown(eventData);
      });

      // Cancelation by external things such as reloading the page.
      eventSource.addEventListener("cancel", (event) => {
        eventSource.close();
      });

      eventSource.addEventListener("cancelByTimeout", (event) => {
        eventSource.close();
        setPaymentStatusMessage(
          "El tiempo limite de espera limite se ha excedido, el vendedor no ha dado respuesta a tu peticion"
        );
        setTimeout(() => {
          setPaymentInProcess(false);
        }, 3000);
        setCountDown("");
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
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {paymentInProcess && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#dedede", // semi-transparent red
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            {paymentStatusMessage.length > 0 ? (
              <>
                <p>{paymentStatusMessage}</p>
              </>
            ) : (
              <>
                <p>Esperando que el cliente acepte tu pago...</p>
                <p>{countDown}</p>
              </>
            )}
          </div>
        </div>
      )}

      <button onClick={payoutRequest}>Solicitar pago</button>
      <button>Aceptar pago</button>
    </div>
  );
}
