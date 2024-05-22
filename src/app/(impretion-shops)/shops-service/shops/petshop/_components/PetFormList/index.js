"use client";

import { FaToolbox } from "react-icons/fa";
import FieldDescription from "../FieldDescription";
import ImageUploader from "../ImageUploader";
import PetSelector from "../PetSelector";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { useShopServicesUserData } from "@/app/_store";
import ProductsSelection from "@/app/(impretion-shops)/shops-service/_components/ProductsSelection";

export default function PetFormList() {
  const { setOrderData, orderData } = useShopServicesUserData();
  const [petFormListData, setPetFormListData] = useState([
    {
      id: 1,
      image: "",
      petName: "",
      petType: "", // Initialize petType as an empty string
      additionalNote: "",
      isActive: true,
    },
  ]);

  const newPetFormHandler = (id) => {
    const updatedPetFormListData = petFormListData.map((pet) => ({
      ...pet,
      isActive: false,
    }));

    setPetFormListData([
      ...updatedPetFormListData,
      {
        id,
        image: "",
        petName: "",
        petType: "",
        additionalNote: "",
        isActive: true,
      },
    ]);
  };

  const showPetFormHandler = (id) => {
    const updatedPetFormListData = petFormListData.map((pet) => ({
      ...pet,
      isActive: pet.id === id,
    }));

    setPetFormListData(updatedPetFormListData);
  };

  const petFormOnChangeHandler = (name, value, id) => {
    setPetFormListData((prevPetFormListData) =>
      prevPetFormListData.map((pet) => {
        if (pet.id === id) {
          console.log("ptm ", name, pet);
          return { ...pet, [name]: value };
        }
        return pet;
      })
    );
  };

  useEffect(() => {
    setOrderData({ ...orderData, petData: petFormListData });
  }, [petFormListData]);

  return (
    <>
      <div className={styles.paragraphBlock}>
        <p style={{ color: "#555555" }}>
          <span style={{ color: "#8C52FF" }}>Ningún campo es obligatorio</span>,
          sin embargo, mientras más información sobre tu mascota nos des,
          podremos proporcionar una mejor personalización.
        </p>
      </div>
      {petFormListData.map((pet, index) => (
        <div key={pet.id} style={{ borderRadius: "6px" }}>
          {pet.isActive ? (
            <div
              key={pet.id}
              style={{
                border: "1.4px dashed #8C52FF",
                margin: "5px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  overflowX: "hidden",
                  backgroundColor: "#f2f2f2",
                  padding: "10px",
                  flexDirection: "column",
                }}
              >
                <FieldDescription>
                  ¡No te preocupes si la foto no está perfecta, nosotros nos
                  encargaremos de mejorarla!{" "}
                  <span style={{ textDecoration: "underline" }}>
                    (No es obligatorio)
                  </span>
                  .
                </FieldDescription>
                <ImageUploader />

                <FieldDescription>
                  Si prefieres, también puedes proporcionarnos el nombre de tu
                  mascota para plasmarlo en el artículo que elijas.{" "}
                  <span style={{ textDecoration: "underline" }}>
                    (No es obligatorio)
                  </span>
                  .
                </FieldDescription>

                <input
                  type="text"
                  placeholder="Nombre de la mascota"
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    marginBottom: "10px",
                    outline: "#8C52FF",
                    fontFamily: "sans-serif",
                    fontSize: "15px",
                  }}
                  maxLength={30}
                  value={petFormListData[index].petName}
                  onChange={(e) =>
                    petFormOnChangeHandler("petName", e.target.value, pet.id)
                  }
                ></input>

                <FieldDescription>
                  Selecciona el tipo de mascota que tienes. ¡De esta forma
                  sabremos cómo personalizar tu producto!.{" "}
                  <span style={{ textDecoration: "underline" }}>
                    (Obligatorio)
                  </span>
                </FieldDescription>

                <PetSelector
                  petFormOnChangeHandler={petFormOnChangeHandler}
                  id={pet.id}
                  index={index}
                  selectedPet={petFormListData[index].petType} // Pass selectedPet as a prop
                />

                <FieldDescription>
                  ¡Puedes darnos comentarios adicionales sobre cómo quieres que
                  personalicemos tu artículo!
                </FieldDescription>
                <textarea
                  style={{
                    height: "100px",
                    marginBottom: "10px",
                    border: "2px solid #8C52FF",
                    resize: "none",
                    borderRadius: "6px",
                    outline: "none",
                    padding: "10px",
                    fontFamily: "sans-serif",
                  }}
                  placeholder="Me gustaria que el color principal fuera el..."
                  onChange={(e) =>
                    petFormOnChangeHandler(
                      "additionalNote",
                      e.target.value,
                      pet.id
                    )
                  }
                  value={petFormListData[index].additionalNote}
                ></textarea>

                <ProductsSelection />
              </div>
            </div>
          ) : (
            <div
              style={{
                margin: "10px",
              }}
              onClick={() => showPetFormHandler(pet.id)}
            >
              {orderData.petData[index].petType === null && (
                <p style={{ fontSize: "12px", color: "red" }}>
                  Debes seleccionar tu tipo de mascota en el apartado
                  &quot;Selecciona tu tipo de mascota&quot;
                </p>
              )}
              <button
                style={{
                  width: "100%",
                  height: "30px",
                  border: "none",
                  outline: "none",
                  background:
                    orderData.petData[index].petType === null
                      ? "red"
                      : "#8C52FF",
                  borderRadius: "4px",
                  color: "#fff",
                }}
              >
                Mascota #{pet.id} {pet.petName ? <>• {pet.petName} •</> : ""}
              </button>
            </div>
          )}
        </div>
      ))}
      <div
        style={{ display: "flex", justifyContent: "center" }}
        onClick={() => newPetFormHandler(petFormListData.length + 1)}
      >
        <button
          style={{
            width: "100%",
            margin: "10px",
            border: "none",
            padding: "10px",
            borderRadius: "4px",
            border: "2px dotted #8C52FF",
            color: "#8C52FF",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#E7DAFF",
            justifyContent: "center",
            height: "35px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FaCirclePlus
              style={{
                fontSize: "20px",
                marginRight: "5px",
              }}
            />
          </div>
          <p>¿Tienes más mascotas?, ¡agrega otra!</p>
        </button>
      </div>
    </>
  );
}
