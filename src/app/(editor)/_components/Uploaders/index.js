"use client";

import {
  useDesignPanelHandler,
  usePreviewMode,
  useStoreItems,
} from "@/app/_store";
import styles from "./styles.module.css";
import { v4 as uuidv4 } from "uuid";
import { TbTextSize } from "react-icons/tb";
import { BsFillPencilFill, BsFillStarFill, BsImage } from "react-icons/bs";
import { useEffect, useState } from "react";
import BuyModalWindow from "./BuyModal";

export default function Uploaders({ product }) {
  const [currentProduct, setCurrentProduct] = useState({});
  const [showLayersBtn, setShowLayersBtn] = useState(false);

  // Adds a new layer to the current layers array (layerItems []).
  const newLayer = useStoreItems((state) => state.setNewLayerItem);

  // the current side of the product example: front: 0, reverse: 1 etc..
  const sideIndex = useStoreItems((state) => state.sideIndex);

  const isPreviewing = usePreviewMode((state) => state.isPreviewing);

  const setPanelHandler = useDesignPanelHandler(
    (state) => state.setDesignPanel
  );

  const showPanel = useDesignPanelHandler((state) => state.designPanel);

  useEffect(() => {
    setCurrentProduct(JSON.parse(product));
  }, [product]);

  // Spawns a new image for as layer and visual item with default values
  const newImageHandler = async (e) => {
    const file = e.target.files[0];
    let imageWidth;
    let imageHeight;

    if (file) {
      const image = new Image();
      image.src = URL.createObjectURL(file);

      image.onload = function () {
        const width = image.width;
        const height = image.height;

        imageWidth = width;
        imageHeight = height;
      };
    }

    // Define the maximum file size limit in bytes
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    if (file && file.size > maxSizeBytes) {
      alert("El archivo ha excedido el límite de tamaño, máximo 5MB.");
      return;
    }

    if (file && file.type.startsWith("image/")) {
      const formData = new FormData();
      formData.append("file", file);

      // Double checks if the image is truly a valid image with a buffer array validation.
      const response = await fetch("api/client/image-validator", {
        method: "POST",
        body: formData,
      });

      const imageData = await response.json();
      if (response.ok && response.status === 200) {
        const reader = new FileReader();
        const inputId = uuidv4();
        reader.onload = () => {
          newLayer(sideIndex, {
            id: inputId,
            inputType: "image",
            imageName: file.name,
            source: reader.result,
            justifyContent: "center", // Center horizontally by default
            alignItems: "center", // Center vertically by default
            imageExtension: imageData.extension,
            imageHeight,
            imageWidth,
          });
        };
        reader.readAsDataURL(file);
      } else {
        alert("Ha ocurrido un error al subir tu archivo.");
      }
    } else {
      alert("Solo se permiten archivos de imágenes JPG/JPEG/PNG.");
    }
  };

  // Spawns a new text for as layer and visual item with default values
  const newTextHandler = () => {
    const inputId = uuidv4();
    newLayer(sideIndex, {
      id: inputId,
      inputType: "text",
      textContent: "Nuevo texto",
      fontSize: "48px",
      fontFamily: "arial",
      justifyContent: "center", // Center horizontally by default
      alignItems: "center", // Center vertically by default
    });
  };

  // Switch the panel global variable (true or false), this opens the design panel
  const newDesignHandler = () => {
    setPanelHandler(!showPanel);
  };

  return (
    <>
      {!isPreviewing && (
        <>
          <div className={styles.items}>
            <div className={styles.addBtns}>
              <label className={styles.imageUploader}>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  name="file"
                  onChange={newImageHandler}
                  onClick={(e) => (e.target.value = "")}
                />
                <BsImage style={{ width: "18px", height: "18px" }} />
                <span>Agregar imagen</span>
              </label>

              <button className={styles.addText} onClick={newTextHandler}>
                <TbTextSize style={{ width: "20px", height: "20px" }} />
                <span style={{ marginLeft: "5px" }}>Agregar texto</span>
              </button>

              <button className={styles.addDesign} onClick={newDesignHandler}>
                <BsFillPencilFill style={{ width: "20px", height: "20px" }} />
                <span>Agregar diseño</span>
                <BsFillStarFill
                  style={{
                    position: "absolute",
                    top: 1,
                    left: 1,
                    color: "#1483FF",
                  }}
                />
              </button>
            </div>

            {/* Responsive add buttons */}
            <div className={styles.responsiveAddBtns}>
              {showLayersBtn && (
                <div className={styles.newLayersPanel}>
                  <label className={styles.imageUploader}>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      name="file"
                      onChange={newImageHandler}
                      onClick={(e) => (e.target.value = "")}
                    />
                    <BsImage style={{ width: "18px", height: "18px" }} />
                    <span style={{ marginLeft: "5px" }}>Agregar imagen</span>
                  </label>

                  <button className={styles.addText} onClick={newTextHandler}>
                    <TbTextSize style={{ width: "20px", height: "20px" }} />
                    <span style={{ marginLeft: "5px" }}>Agregar texto</span>
                  </button>

                  <button
                    className={styles.addDesign}
                    onClick={newDesignHandler}
                  >
                    <BsFillPencilFill
                      style={{ width: "20px", height: "20px" }}
                    />
                    <span style={{ marginLeft: "5px" }}>Agregar diseño</span>
                    <BsFillStarFill
                      style={{
                        position: "absolute",
                        top: 1,
                        left: 1,
                        color: "#1483FF",
                      }}
                    />
                  </button>
                </div>
              )}
              <button
                className={styles.addLayerBtn}
                onClick={() => setShowLayersBtn(!showLayersBtn)}
              >
                Agregar
              </button>
            </div>

            <div className={styles.bottom}>
              <div className={styles.impretionInfo}>
                {Object.keys(currentProduct).length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "17px",
                      margin: "auto",
                      background: "#e3e4e5",
                      color: "#333",
                      padding: "6px",
                    }}
                  >
                    <p>Area de impresión</p>
                    <span>
                      {currentProduct?.canvasSize?.width?.pixels}x
                      {currentProduct?.canvasSize?.height?.pixels}
                      <span> pixeles </span>
                      <span> (300 DPI)</span>
                    </span>
                  </div>
                )}
              </div>

              <BuyModalWindow currentProduct={JSON.stringify(currentProduct)} />

              <div className={styles.payuMsg}>
                <hr />
                <span
                  style={{ marginTop: "15px", fontSize: "10px", color: "#333" }}
                >
                  Utilizamos PayU como metodo de pago para que tu compra sea
                  segura.
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
