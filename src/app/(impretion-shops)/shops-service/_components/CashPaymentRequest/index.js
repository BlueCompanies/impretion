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
import { hasCookie, setCookie } from "cookies-next";

export default function CashPaymentRequest() {
  const [cashPaymentInProcess, setCashPaymentInProcess] = useState(false);
  const [onlinePaymentInProcess, setOnlinePaymentInProcess] = useState(false);

  const [showSummaryPaymentModalWindow, setShowSummaryPaymentModalWindow] =
    useState(false);
  const [paymentType, setPaymentType] = useState("");

  const [paymentRequestAccepted, setPaymentRequestAccepted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const { setOrderData, orderData } = useShopServicesUserData();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // User messages feedback
  const [paymentStatusMessage, setPaymentStatusMessage] = useState("");
  //const [countDown, setCountDown] = useState("");

  // Generates the API identifier so it can be manipulated by POST request i.e
  const uid = new ShortUniqueId({ length: 10 });
  const generatedId = uid.rnd();

  /*
  HAY QUE PONER UN TOKEN DE SSION, CUANDO SE ACEPTE/DENIEGE/CANCELE BY TIMEOUT
  UNA ORDEN, SE VENCERA/ELIMINARA EL TOKEN, EL USUARIO DEBERA VOLVER A SCANEAR EL CODIGO PARA VOLVER A CREAR OTRA SESION.
  QUIZA EL TOKEN DESDE LA DB SE VENZA LUEGO DE UN TIEMPO...

  PONER UNA COOKIE EN EL NAVEGADOR DEL CLIENTE CONECTARLA A UNA BASE DE DATOS Y PONERLE MAXIMO 3 TRIES ESTO PARA EL PAGO EN LINEA.
  LUEGO DE LOS TRIES SE CERRARA LA SESION, NO PODRA VOLVER A HACER NINGUNA TRANSACCION HASTA VOLVER A SCANEAR (TENER UN NUEVO TOKEN)
  */

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
  const onlinePayoutRequest = () => {};

  useEffect(() => {
    if (paymentRequestAccepted && paymentType === "cashPayment") {
      cashPayoutRequest();
    }

    if (paymentRequestAccepted && paymentType === "onlinePayment") {
      //payoutRequest();
      setOnlinePaymentInProcess(true);
    }
  }, [paymentRequestAccepted]);

  const modalWindowHandler = (paymentType) => {
    const { userData, buyData } = orderData;
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

    // Check buyData fields
    const updatedBuyData = buyData.map((pet) => {
      const petType = pet.petType ? pet.petType.trim() : "";
      if (petType.length === 0) {
        return { ...pet, petType: null };
      }
      return pet;
    });
    const buyDataHasNullFields = updatedBuyData.some(
      (pet) => pet.petType === null
    );

    // Update state if necessary
    if (userDataHasNullFields || buyDataHasNullFields) {
      setOrderData({
        ...orderData,
        userData: updatedUserData,
        buyData: updatedBuyData,
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
                  Código de cliente -{" "}
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
                pago.
              </p>
              <p style={{ marginTop: "5px" }}>Puedes cerrar esta ventana.</p>

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
            </div>
          </ModalMessage>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
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
            Pagar después por transferencia
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
