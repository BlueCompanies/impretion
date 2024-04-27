"use client";

import { useState } from "react";
import { FaCat, FaDog } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

export default function PetSelector({ petFormOnChangeHandler, id }) {
  const [showPetList, setShowPetList] = useState(false);
  const [selectedPet, setSelectedPet] = useState({ pet: "" });

  const selectedPetHandler = (pet) => {
    setSelectedPet({ pet });
    petFormOnChangeHandler("petType", pet, id);
    setShowPetList(false);
  };

  return (
    <div style={{ color: "#555555", marginBottom: "10px" }}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "5px",
          borderRadius: "4px",
          height: "35px",
          display: "flex",
          alignItems: "center",
          background: "#fff",
        }}
        onClick={() => setShowPetList(!showPetList)}
      >
        <div>
          {selectedPet.pet ? (
            <>
              Seleccionaste: {selectedPet.icon} {selectedPet.pet}
            </>
          ) : (
            <div style={{ display: "flex" }}>
              <IoMdArrowDropdown
                style={{ marginRight: "10px", fontSize: "18px" }}
              />
              <p>Selecciona tu mascota</p>
            </div>
          )}
        </div>
      </div>
      <div>
        {showPetList && (
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
              onClick={() => selectedPetHandler("Gato", "FaDog")}
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
