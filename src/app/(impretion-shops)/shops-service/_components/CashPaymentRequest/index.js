"use client";

import { useState, useEffect } from "react";
import ShortUniqueId from "short-unique-id";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import PaymentSummaryModalWindow from "../PaymentSummaryModalWindow";
import PaymentTimer from "../PaymentTimer";
import { MdCancel } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import { useShopServicesUserData } from "@/app/_store";
import ModalMessage from "../ModalMessage";
import { deleteCookie, getCookie } from "cookies-next";
import dataUpdate from "@/app/_lib/shop/dataUpdate";

export default function CashPaymentRequest({ currentSession }) {
  const [cashPaymentInProcess, setCashPaymentInProcess] = useState(false);
  const [onlinePaymentInProcess, setOnlinePaymentInProcess] = useState(false);

  const [showSummaryPaymentModalWindow, setShowSummaryPaymentModalWindow] =
    useState(false);
  const [paymentType, setPaymentType] = useState("");

  const [paymentRequestAccepted, setPaymentRequestAccepted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const { setOrderData, orderData } = useShopServicesUserData();

  const [expiredSession, setExpiredSession] = useState(false);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // User messages feedback
  const [paymentStatusMessage, setPaymentStatusMessage] = useState("");
  //const [countDown, setCountDown] = useState("");

  // Generates the API identifier so it can be manipulated by POST request i.e
  const uid = new ShortUniqueId({ length: 10 });
  const generatedId = uid.rnd();

  // Cash payment by client
  const cashPayoutRequest = () => {
    if (generatedId) {
      setPaymentStatusMessage("");
      setCashPaymentInProcess(true);
      setPaymentStatus("");

      const params = new URLSearchParams(searchParams);
      console.log(generatedId);
      params.set("payoutId", generatedId);
      replace(`${pathname}?${params.toString()}`);

      const eventSource = new EventSource(
        `/api/shop-system/cash-payment-seller-processing/${generatedId}?shopRef=rNGfsGUXaJ5gqctXyDX5VB&clientData=${JSON.stringify(
          orderData.userData
        )}`
      );

      // *** Payment status by vendor listeners ***
      eventSource.addEventListener("denied", (event) => {
        eventSource.close();
        setPaymentStatus("denied");
        setPaymentStatusMessage(event.data);
        // CLOSE TAB AFTER SOME SECONDS
      });

      eventSource.addEventListener("accepted", (event) => {
        eventSource.close();
        setPaymentStatus("accepted");
        setPaymentStatusMessage(event.data);
        // CLOSE TAB AFTER SOME SECONDS
      });
      // *** Payment status by vendor listeners ***

      // Cancelation by external things such as reloading the page.
      eventSource.addEventListener("cancel", () => {
        //eventSource.close();
        setTimeout(() => {
          setCashPaymentInProcess(false);
          setPaymentRequestAccepted(false);
          eventSource.close();
        }, 6000000);
        //setCountDown("");
        // state reset
        setPaymentStatus("denied");
      });

      // Approved event listener when the buyer accepts
      eventSource.addEventListener("approved", () => {
        //eventSource.close();
        setTimeout(() => {
          setCashPaymentInProcess(false);
          setPaymentRequestAccepted(false);
          eventSource.close();
        }, 6000000);
        //setCountDown("");
        // state reset
        setPaymentStatus("accepted");
      });

      eventSource.addEventListener("cancelByTimeout", () => {
        console.log("mrd cancel timeoutome");
        eventSource.close();
        setPaymentStatusMessage(
          "El tiempo limite de espera limite se ha excedido, el vendedor no ha dado respuesta a tu peticion"
        );
        setTimeout(() => {
          setCashPaymentInProcess(false);
        }, 300000000);
        // setCountDown("");
        // state reset
        setPaymentRequestAccepted(false);
        setPaymentStatus("denied");
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

  // Online payment by client
  const onlinePayoutRequest = async (currentSession) => {
    const shopRef = searchParams.get("shopRef");
    if (!shopRef) {
      alert(
        "No se ha encontrado ninguna tienda de referencia, por favor, vuelve a scanear el QR."
      );
    }

    // Save user's data and buy data
    // send the data the customer's data to the DB and close/delete the session
    await fetch(
      "/api/shop-system/client-session-count-handler/session-data-manager",
      {
        method: "POST",
        headers: { ContentType: "application/json" },
        body: JSON.stringify({
          currentSession,
          shopRef,
          orderData,
          orderType: "onlinePayment",
        }),
      }
    );
  };

  useEffect(() => {
    if (paymentRequestAccepted) {
      console.log(paymentRequestAccepted);
      // Get the current client session cookie
      const clientSession = getCookie("clientSession");

      // Manages the user's payment tries.
      const fetchClientSessionCountData = async (filter, update) => {
        await fetch(`/api/shop-system/client-session-count-handler`, {
          method: "POST",
          headers: { ContentType: "application/json" },
          body: JSON.stringify({
            filter,
            update,
          }),
        });
      };

      // get the current client session count
      if (currentSession) {
        if (
          paymentRequestAccepted &&
          paymentType === "cashPayment" &&
          currentSession?.paymentTries?.cashPaymentTries > 0
        ) {
          fetchClientSessionCountData(
            { sessionId: clientSession },
            { $inc: { "paymentTries.cashPaymentTries": -1 } }
          ).then((res) => res);
          cashPayoutRequest();
        }

        if (
          paymentRequestAccepted &&
          paymentType === "onlinePayment" &&
          currentSession.paymentTries.onlinePaymentTries > 0
        ) {
          //After an online payout is requested, the session should be deleted.
          fetchClientSessionCountData(
            { sessionId: clientSession },
            { $inc: { "paymentTries.onlinePaymentTries": -1 } }
          ).then((res) => res);
          onlinePayoutRequest().then((res) => res);
          setOnlinePaymentInProcess(true);
        }
      }
    }
  }, [paymentRequestAccepted]);

  const modalWindowHandler = (paymentType) => {
    const { userData, petData } = orderData;
    const fieldsToCheck = ["fullName", "address", "cellphone"];

    // Check userData fields
    let updatedUserData = { ...userData };
    let userDataHasNullFields = false;
    for (const field of fieldsToCheck) {
      const fieldValue = userData[field];
      if (fieldValue === null || fieldValue.trim().length === 0) {
        updatedUserData = { ...updatedUserData, [field]: null };
        userDataHasNullFields = true;
      }
    }

    // Check petData fields
    const updatedPetData = petData.map((pet) => {
      const petType = pet.petType ? pet.petType.trim() : "";
      if (petType.length === 0) {
        return { ...pet, petType: null };
      }
      return pet;
    });
    const petDataHasNullFields = updatedPetData.some(
      (pet) => pet.petType === null
    );

    // Update state if necessary
    if (userDataHasNullFields || petDataHasNullFields) {
      setOrderData({
        ...orderData,
        userData: updatedUserData,
        petData: updatedPetData,
      });
    } else {
      setShowSummaryPaymentModalWindow(!showSummaryPaymentModalWindow);
      setPaymentType(paymentType);
    }
  };

  useEffect(() => {
    // Apply overflow hidden to the body when payment process is active
    if (cashPaymentInProcess) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = ""; // Revert to default when payment process is not active
    }

    // Clean up function to remove overflow hidden when component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [cashPaymentInProcess]);

  return (
    <div style={{ width: "100%", margin: "10px" }}>
      <>
        {expiredSession && (
          <ModalMessage>
            <div style={{ fontSize: "12px", color: "#555" }}>
              Esta sesion ya ha caducado, si quieres volver a hacer otro pedido
              por favor, vuelve a scanear el QR. Por favor cierra esta pagina
              <p style={{ fontSize: "11px", marginTop: "10px" }}>
                Estas medidas son medidas de seguridad.
              </p>
            </div>
          </ModalMessage>
        )}

        {cashPaymentInProcess && (
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
                <PaymentTimer paymentStatus={paymentStatus} />
              </div>
              {paymentStatusMessage.length > 0 ? (
                <div style={{ width: "100%", margin: "auto" }}>
                  <div
                    style={{
                      marginTop: "15px",
                      color: paymentStatus === "denied" ? "red" : "green",
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ width: "20px" }}>
                      <MdCancel />
                    </div>
                    <div>
                      <p>{paymentStatusMessage}</p>
                    </div>
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
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <p style={{ color: "#555", margin: "auto" }}>
                  Código de transacción -{" "}
                  {searchParams.get("payoutId") &&
                    searchParams.get("payoutId").toLocaleLowerCase()}
                </p>
              </div>
            </div>
          </div>
        )}

        {onlinePaymentInProcess && (
          <ModalMessage>
            <div style={{ fontSize: "12px", color: "#555" }}>
              <p>
                Haremos un diseño de acuerdo a las preferencias de diseño que
                nos diste, nos pondremos en contacto contigo para acordar el
                pago y los diseños.
              </p>
              <p>
                Recuerda que puedes ponerte en contacto con nosotros al numero{" "}
                <span>314872192</span>
              </p>
              <p style={{ marginTop: "5px" }}>Puedes cerrar esta ventana.</p>
            </div>
          </ModalMessage>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {/*
          <button
            onClick={() => modalWindowHandler("cashPayment")}
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
            Solicitar pago en efectivo
          </button>
        */}

          <button
            onClick={() => modalWindowHandler("onlinePayment")}
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
            Enviar solicitud
          </button>
        </div>

        {showSummaryPaymentModalWindow && (
          <PaymentSummaryModalWindow
            setShowSummaryPaymentModalWindow={setShowSummaryPaymentModalWindow}
            setPaymentRequestAccepted={setPaymentRequestAccepted}
            paymentType={paymentType}
            orderData={orderData}
          />
        )}
      </>
    </div>
  );
}
