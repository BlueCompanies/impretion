"use client";

import { useShopServicesUserData } from "@/app/_store";
import { useEffect, useState } from "react";

export default function CustomerDeliveryData() {
  const [userDeliveryData, setUserDeliveryData] = useState({
    fullName: "",
    address: "",
    addressNote: "",
    cellphone: "",
  });
  const { setOrderData, orderData } = useShopServicesUserData();

  const addressDeliveryHandler = (e) => {
    const { name, value } = e.target;
    setUserDeliveryData({ ...userDeliveryData, [name]: value });
  };

  useEffect(() => {
    setOrderData({ ...orderData, userData: userDeliveryData });
  }, [userDeliveryData]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          color: "#555555",
          marginBottom: "5px",
          justifyContent: "center",
          border: "1.4px dashed #ccc",
          padding: "10px",
          borderRadius: "6px",
          color: "#555",
        }}
      >
        <p style={{ margin: "auto" }}>Datos de entrega</p>

        <label style={{ marginTop: "5px" }}>
          <span style={{ fontSize: "12px" }}>Tu nombre completo</span>
          <input
            type="text"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginBottom: "5px",
              outline: "#8C52FF",
              fontFamily: "sans-serif",
              fontSize: "15px",
            }}
            placeholder="Nombre de la persona que recibe"
            name="fullName"
            onChange={(e) => addressDeliveryHandler(e)}
          ></input>
        </label>

        <label style={{ marginTop: "5px" }}>
          <span style={{ fontSize: "12px" }}>Dirección</span>
          <input
            type="text"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginBottom: "5px",
              outline: "#8C52FF",
              fontFamily: "sans-serif",
              fontSize: "15px",
            }}
            placeholder="Dirección de entrega"
            name="address"
            onChange={(e) => addressDeliveryHandler(e)}
          ></input>
        </label>

        <label style={{ marginTop: "5px" }}>
          <span style={{ fontSize: "12px" }}>
            Algún comentario adicional acerca de la dirección
          </span>
          <input
            type="text"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginBottom: "5px",
              outline: "#8C52FF",
              fontFamily: "sans-serif",
              fontSize: "15px",
            }}
            placeholder="Comentario adicional de entrega"
            name="addressNote"
            onChange={(e) => addressDeliveryHandler(e)}
          ></input>
        </label>

        <label style={{ marginTop: "5px" }}>
          <span style={{ fontSize: "12px" }}>
            Número de celular de contacto
          </span>
          <input
            type="text"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginBottom: "5px",
              outline: "#8C52FF",
              fontFamily: "sans-serif",
              fontSize: "15px",
            }}
            placeholder="Tú numero de celular"
            name="cellphone"
            onChange={(e) => addressDeliveryHandler(e)}
          ></input>
        </label>
      </div>
    </>
  );
}
