"use client";

import FieldDescription from "../../shops/petshop/_components/FieldDescription";
import { IoCloseCircle } from "react-icons/io5";
import { hasCookie, setCookie } from "cookies-next";
import AcceptAndProcessPaymentButton from "./AcceptAndProcessPaymentButton";
import { useEffect } from "react";
import ShortUniqueId from "short-unique-id";

export default function PaymentSummaryModalWindow({
  setShowSummaryPaymentModalWindow,
  setPaymentRequestAccepted,
  orderData,
}) {
  const { petData } = orderData;

  // Esta cookies seteada debe borrarse al mismo tiempo que el documento en mongodb que la contiene.

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor:
          "rgba(0, 0, 0, 0.5)" /* Semi-transparent black background */,
        backdropFilter: "blur(8px)" /* Apply blur effect */,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "90%",
        }}
      >
        <button
          onClick={() => setShowSummaryPaymentModalWindow(false)}
          style={{
            borderRadius: "3px 3px 0px 0px",
            outline: "none",
            border: "none",
            height: "30px",
            outline: "none",
            background: "#EE1D52",
            color: "#fff",
            padding: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#B4002E",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              height: "100%",
            }}
          >
            <IoCloseCircle style={{ fontSize: "16px" }} />
          </div>{" "}
          <div
            style={{
              display: "flex",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ marginLeft: "5px" }}>Cerrar</p>
          </div>
        </button>
      </div>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "0px 4px 0px 4px",
          width: "90%",
        }}
      >
        <FieldDescription>
          Paga en efectivo y dale en &quot;Aceptar&quot; para que el vendedor
          procese tu compra.
        </FieldDescription>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            maxHeight: "300px",
            padding: "10px",
            fontSize: "15px",
            overflowY: "auto",
          }}
        >
          <p style={{ color: "#555", fontSize: "15px" }}>Resumen</p>
          {petData &&
            petData.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "10px",
                  marginTop: "20px",
                  color: "#555",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    transform: "translateY(-20px)",
                    background: "#fff",
                    padding: "0px 5px 0px 5px",
                    width: "fit-content",
                  }}
                >
                  {item.petName ? <>{item.petName}</> : <>Mascota #{item.id}</>}
                </div>
                <ul
                  style={{
                    listStyleType: "none",
                    fontSize: "12px",
                    color: "#555",
                  }}
                >
                  <li style={{ marginBottom: "10px" }}>
                    {item.petName ? (
                      <>
                        • El diseño estará centrado en el nombre de tu mascota:{" "}
                        {item.petName}.
                      </>
                    ) : (
                      <>
                        • No has elegido un nombre para esta mascota, por lo que
                        en el diseño no se proporcionará ningún nombre.
                      </>
                    )}
                  </li>
                  <li style={{ marginBottom: "10px" }}>
                    {item.petType ? (
                      <>
                        • El estilo de tu diseño estará enfocado en la mascota
                        que elegiste, en este caso: {item.petType}.
                      </>
                    ) : (
                      <>
                        • No has indicado si tu mascota es Perro o Gatto, por lo
                        que tu diseño sera neutral.
                      </>
                    )}
                  </li>

                  <li style={{ marginBottom: "10px" }}>
                    {item.image ? (
                      <>• Usaremos esta imagen como referencia: {item.image}.</>
                    ) : (
                      <>
                        • No subiste ninguna imagen de refenrecia, por lo que
                        usaremos diseños más generales.
                      </>
                    )}
                  </li>

                  <li
                    style={{
                      marginBottom: "10px",
                      maxHeight: "100px",
                      overflowY: "auto",
                    }}
                  >
                    {item.additionalNote ? (
                      <>
                        • Nos indicaste esto como notas adicionales, lo
                        tendremos en cuenta a la hora de realizar tu diseño:{" "}
                        {item.additionalNote}
                      </>
                    ) : (
                      <>• No indicaste ninguna nota adicional.</>
                    )}
                  </li>
                </ul>
              </div>
            ))}
        </div>
      </div>
      <div
        style={{ display: "flex", width: "90%", justifyContent: "flex-end" }}
      >
        <AcceptAndProcessPaymentButton
          setPaymentRequestAccepted={setPaymentRequestAccepted}
          setShowSummaryPaymentModalWindow={setShowSummaryPaymentModalWindow}
        />
      </div>
    </div>
  );
}
