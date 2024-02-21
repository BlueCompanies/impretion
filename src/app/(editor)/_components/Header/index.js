"use client";

import Link from "next/link";
import styles from "./styles.module.css";
import { usePreviewMode, useStoreItems } from "@/app/_store";
import {
  BsBoxArrowLeft,
  BsArrowLeftShort,
  BsFillEyeFill,
} from "react-icons/bs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function Header({ productId, productName, editor }) {
  const isPreviewing = usePreviewMode((state) => state.isPreviewing);
  const setPreviewMode = usePreviewMode((state) => state.setPreviewMode);
  const changeIndex = useStoreItems((state) => state.setSideIndex);
  const sideIndex = useStoreItems((state) => state.sideIndex);
  const layers = useStoreItems((state) => state.layerItems);

  const previewMode = () => {
    // Switch between true or false the preview mode
    setPreviewMode(true);
  };

  const changeSideIndex = (index) => {
    changeIndex(index);
  };

  const closePreview = () => {
    setPreviewMode(false);
  };

  return (
    <>
      <div className={styles.header}>
        {isPreviewing && (
          <button className={styles.outOfPreviewBtn} onClick={closePreview}>
            <AiOutlineArrowLeft />
            Salir de la previsualización
          </button>
        )}

        <div
          style={{
            display: "flex",
            width: "50%",
            justifyContent: "flex-between", // Change to flex-start
            alignItems: "center", // Align items vertically in the center
            visibility: isPreviewing ? "hidden" : "",
          }}
        >
          <ConfirmLink layersLength={layers.length} productId={productId}>
            <div
              style={{
                display: "flex",
                cursor: "pointer",
                marginLeft: "15px",
              }}
            >
              <BsBoxArrowLeft
                className={styles.outArrow}
                style={{ marginRight: "5px" }}
              />
              <span className={styles.outText}>Salir del editor</span>
            </div>
          </ConfirmLink>
          <p
            className={styles.productNameText}
            style={{ fontWeight: "700", marginLeft: "30px" }}
          >
            {productName}
          </p>
        </div>

        <div className={styles.rightHeaderConfig}>
          {editor.sides.length > 1 && (
            <div
              style={{
                visibility: isPreviewing ? "hidden" : "",
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              {editor.sides.map((side, index) => (
                <>
                  <button
                    key={index}
                    onClick={() => changeSideIndex(index)}
                    className={`${
                      index === 0
                        ? styles.firstBtn
                        : index === editor.sides.length - 1
                        ? styles.lastBtn
                        : styles.middleBtn
                    }
                    ${index === sideIndex && styles.activeBtn}
                    `} // Add the 'button' class to all buttons
                  >
                    {side?.sideTypeES}
                  </button>
                </>
              ))}
            </div>
          )}

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end", // Align the button to the right
              alignItems: "flex-start", // Align items at the top
            }}
          >
            {!isPreviewing && (
              <button
                style={{
                  display: "flex",
                  padding: "8px",
                  border: "none",
                  borderRadius: "6px",
                  alignItems: "center",
                  cursor: "pointer",
                  fontWeight: "600",
                  margin: "10px",
                }}
                onClick={previewMode}
              >
                <span className={styles.previewDesignText}>
                  Previsualizar diseño
                </span>
                <span className={styles.mobilePreviewDesignText}>
                  Ver diseño
                </span>
                <BsFillEyeFill style={{ marginLeft: "5px" }} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const ConfirmLink = ({ layersLength, productId, children }) => {
  const router = useRouter();

  const leaveHandler = (e) => {
    if (layersLength > 0) {
      if (
        window.confirm(
          "Hay cambios sin guardar. ¿Seguro que quieres salir del editor?"
        )
      ) {
        // User accepted, navigate to /product/${productId}
        router.push(`/product/${productId}`);
      } else {
        // User canceled, stay on the current page
        e.preventDefault();
      }
    } else {
      // No unsaved changes, navigate to /product/${productId}
      router.push(`/product/${productId}`);
    }
  };

  return (
    <a href="#" onClick={leaveHandler}>
      {children}
    </a>
  );
};
