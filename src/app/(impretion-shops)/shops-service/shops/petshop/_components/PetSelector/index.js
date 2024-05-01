"use client";

import { useShopServicesUserData } from "@/app/_store";
import { useState } from "react";
import { FaCat, FaDog } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

export default function PetSelector({
  petFormOnChangeHandler,
  id,
  index,
  selectedPet, // Receive selectedPet as a prop
}) {
  const [showPetTypeList, setShowPetTypeList] = useState(false);
  const { setOrderData, orderData } = useShopServicesUserData();

  const selectedPetHandler = (pet) => {
    petFormOnChangeHandler("petType", pet, id);
    setShowPetTypeList(false);
  };

  return (
    <div style={{ color: "#555555", marginBottom: "10px" }}>
      {orderData?.buyData[index]?.petType === null && (
        <p style={{ fontSize: "12px", color: "red" }}>
          Debes seleccionar tu tipo de mascota, basándonos en esto, podremos
          hacer un mejor diseño en tu artículo.
        </p>
      )}
      <div
        style={{
          padding: "5px",
          borderRadius: "4px",
          height: "35px",
          display: "flex",
          alignItems: "center",
          background: "#fff",
          border:
            orderData?.buyData[index]?.petType === null
              ? "1px solid red"
              : "1px solid #ccc",
        }}
        onClick={() => setShowPetTypeList(!showPetTypeList)}
      >
        <div>
          {selectedPet ? ( // Use the selectedPet prop
            <>Seleccionaste: {selectedPet}</>
          ) : (
            <div
              style={{
                display: "flex",
                color: orderData?.buyData[index]?.petType === null && "red",
              }}
            >
              <IoMdArrowDropdown
                style={{ marginRight: "10px", fontSize: "18px" }}
              />
              <p>Selecciona tu tipo de mascota</p>
            </div>
          )}
        </div>
      </div>
      <div>
        {showPetTypeList && (
          <>
            <div
              style={{
                display: "flex",
                padding: "5px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginTop: "5px",
                alignItems: "center",
                fontSize: "17px",
                background: "#fff",
              }}
              onClick={() => selectedPetHandler("Perro")}
            >
              <div
                style={{
                  marginRight: "10px",
                  backgroundColor: "#8C52FF",
                  borderRadius: "50%",
                  width: "23px",
                  display: "flex",
                  height: "23px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FaDog style={{ fontSize: "18px", color: "#fff" }} />
              </div>
              <p>Perro</p>
            </div>
            <div
              style={{
                display: "flex",
                padding: "5px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginTop: "5px",
                alignItems: "center",
                fontSize: "17px",
                background: "#fff",
              }}
              onClick={() => selectedPetHandler("Gato")}
            >
              <div
                style={{
                  marginRight: "10px",
                  backgroundColor: "#8C52FF",
                  borderRadius: "50%",
                  width: "23px",
                  display: "flex",
                  height: "23px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FaCat style={{ fontSize: "18px", color: "#fff" }} />
              </div>
              <p>Gato</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
