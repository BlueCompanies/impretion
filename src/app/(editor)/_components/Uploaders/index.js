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

export default function Uploaders() {
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
          //imageExtension: imageData.extension,
          transform: {
            translate: "translate(0px, 0px)",
            rotate: "rotate(0deg)",
            scale: "scale(1)",
          },
          imageHeight,
          imageWidth,
        });
      };
      reader.readAsDataURL(file);
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
      textColor: "#000000",
      fontFamily: "arial",
      justifyContent: "center", // Center horizontally by default
      alignItems: "center", // Center vertically by default
      transform: {
        translate: "translate(0px, 0px)",
        rotate: "rotate(0deg)",
        scale: "scale(1)",
      },
    });
  };

  // Switch the panel global variable (true or false), this opens the design panel
  // newDesignHandler is on Designs component
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
          </div>
        </>
      )}
    </>
  );
}
