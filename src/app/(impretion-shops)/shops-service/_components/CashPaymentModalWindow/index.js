"use client";
import { MdSell } from "react-icons/md";
import FieldDescription from "../../shops/petshop/_components/FieldDescription";
import { IoCloseCircle } from "react-icons/io5";
import { useShopServicesUserData } from "@/app/_store";

export default function CashPaymentModalWindow({
  setShowModalWindow,
  setPaymentRequestAccepted,
}) {
  const { orderData } = useShopServicesUserData();
  const { userData, buyData } = orderData;

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
          onClick={() => setShowModalWindow(false)}
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
          <p>Resumen de tu compra</p>
          {buyData &&
            buyData.map((item) => (
              <div key={item.id}>
                <p>{item.petName}</p>
              </div>
            ))}
        </div>
      </div>
      <div
        style={{ display: "flex", width: "90%", justifyContent: "flex-end" }}
      >
        <button
          onClick={() => {
            setPaymentRequestAccepted(true), setShowModalWindow(false);
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
      </div>
    </div>
  );
}
