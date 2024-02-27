"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Uploaders from "../Uploaders";
import Layers from "../Layers";
import {
  useDesignPanelHandler,
  useGeneratedMockups,
  usePreviewMode,
} from "@/app/_store";
import GenericLoader from "@/app/_components/Loaders/MockupGeneratedLoader";
import BuyModalWindow from "./BuyModal";
import { BiSolidDownload } from "react-icons/bi";

export default function SideSection({ product }) {
  const isPreviewing = usePreviewMode((state) => state.isPreviewing);
  const generatedMockups = useGeneratedMockups((state) => state.mockups);
  const generatedMockupsLength = useGeneratedMockups(
    (state) => state.mockupsLength
  );
  const setCurrentMockupImage = useGeneratedMockups(
    (state) => state.setCurrentMockupImage
  );
  const resetGeneratedMockups = useGeneratedMockups(
    (state) => state.resetMockups
  );
  const setGeneratedMockupsLength = useGeneratedMockups(
    (state) => state.setMockupsLength
  );
  const setPanelHandler = useDesignPanelHandler(
    (state) => state.setDesignPanel
  );
  const setPreviewMode = usePreviewMode((state) => state.setPreviewMode);

  const [parsedProduct, setParsedProduct] = useState({});

  // Parses the product data as its stringified.
  useEffect(() => {
    const parsedProduct = product ? JSON.parse(product) : {};
    setParsedProduct(parsedProduct);
  }, [product]);

  // State to keep track of loaded images
  const [loadedImages, setLoadedImages] = useState(
    new Array(generatedMockupsLength).fill(false)
  );

  useEffect(() => {
    // Sets the first element by default if the array is not empty.
    if (generatedMockups.length > 0) {
      setCurrentMockupImage(generatedMockups[0]);
    }
  }, [generatedMockups]);

  useEffect(() => {
    // Reset loadedImages array when mockups length changes
    setLoadedImages(new Array(generatedMockupsLength).fill(false));
  }, [generatedMockupsLength]);

  // Function to handle image load event
  const handleImageLoad = (index) => {
    setLoadedImages((prev) => {
      const updatedLoadedImages = [...prev];
      updatedLoadedImages[index] = true;
      return updatedLoadedImages;
    });
  };

  const currentSelectedImage = (src) => {
    setCurrentMockupImage(src);
  };

  useEffect(() => {
    if (!isPreviewing) {
      setLoadedImages([]);
      resetGeneratedMockups();
      setGeneratedMockupsLength(0);
      setCurrentMockupImage("");
      setPreviewMode(false);
      setPanelHandler(false);
    }
  }, [isPreviewing]);

  const handleImageDownload = (imageSrc, imageName) => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className={styles.sideSection}>
        {isPreviewing ? (
          <>
            <div className={styles.mockupSection}>
              {generatedMockups.map((mockup, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={mockup}
                    alt={`Mockup ${index}`}
                    style={{
                      width: "100%",
                      height: "345px",
                      borderRadius: "3px",
                      cursor: "pointer",
                      opacity: 1,
                      transition: "opacity 1s ease",
                      objectFit: "cover",
                    }}
                    onClick={() => currentSelectedImage(mockup)}
                    onLoad={() => handleImageLoad(index)} // Handle image load event
                  />
                  <button
                    style={{
                      position: "absolute",
                      fontSize: "35px",
                      padding: "5px",
                      top: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      margin: "5px",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      outline: "none",
                      border: "none",
                    }}
                    onClick={() =>
                      handleImageDownload(mockup, `Mockup #${index}`)
                    }
                  >
                    <BiSolidDownload
                      style={{ color: "#fff", cursor: "pointer" }}
                    />
                  </button>
                </div>
              ))}
              {/* The loaders templates */}
              {Array(generatedMockupsLength)
                .fill()
                .map((_, index) => (
                  <div key={index}>
                    <div>
                      <div>
                        {!loadedImages[index] && (
                          <div
                            style={{
                              display: "flex",
                              width: "100%",
                              padding: "5px",
                              height: "345px",
                              borderRadius: "3px",
                              background: "#ededed",
                              alignContent: "center",
                              justifyContent: "center",
                              margin: "auto",
                              alignItems: "center",
                              marginBottom: "4px",
                            }}
                          >
                            <GenericLoader />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <>
            <Uploaders product={JSON.stringify(product ? product : "")} />
            <Layers />
            <div className={styles.bottom}>
              <div className={styles.impretionInfo}>
                {Object.keys(product).length > 0 && (
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
                      {parsedProduct.canvasSize
                        ? parsedProduct.canvasSize.width.pixels
                        : ""}
                      x
                      {parsedProduct.canvasSize
                        ? parsedProduct.canvasSize.height.pixels
                        : ""}
                      <span> pixeles </span>
                    </span>
                    <p> (300 DPI)</p>
                  </div>
                )}
                <BuyModalWindow currentProduct={product} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile mockup images adaptation */}
      {isPreviewing && (
        <div className={styles.mockupSection}>
          {generatedMockups.map((mockup, index) => (
            <div key={mockup}>
              <img
                src={mockup}
                alt={`Mockup ${index}`}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "3px",
                  cursor: "pointer",
                  opacity: 1,
                  transition: "opacity 1s ease",
                  objectFit: "cover",
                  margin: "4px",
                }}
                onClick={() => currentSelectedImage(mockup)}
                onLoad={() => handleImageLoad(index)} // Handle image load event
              />
            </div>
          ))}
          {/* The loaders templates */}
          {Array(generatedMockupsLength)
            .fill()
            .map((_, index) => (
              <div key={index}>
                <div>
                  <div>
                    {!loadedImages[index] && (
                      <div
                        style={{
                          display: "flex",
                          width: "80px",
                          height: "80px",
                          padding: "5px",
                          borderRadius: "3px",
                          background: "#ededed",
                          alignContent: "center",
                          justifyContent: "center",
                          margin: "4px",
                          alignItems: "center",
                        }}
                      >
                        <GenericLoader />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
