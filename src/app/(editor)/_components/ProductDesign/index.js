"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import {
  useDesignPanelHandler,
  usePreviewMode,
  useStoreItems,
} from "@/app/_store";
import { toPng } from "html-to-image";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import awsS3 from "@/app/_lib/aws";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Image from "next/image";
import CommonLoader from "@/app/_components/Loaders/CommonLoader";
import ImageCarousel from "@/app/_components/ImageCarrousel";

export default function ProductDesign({ product, children }) {
  const iframeRef = useRef(null);
  const workflowRef = useRef(null); // Add a ref for the workflow div
  const [finalPreview, setFinalPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [processedSide, setProcessedSide] = useState(0);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [divisorNumber, setDivisorNumber] = useState(1);
  const [steps, setSteps] = useState({
    step: 0,
    message: "",
  });

  const sideIndexChanger = useStoreItems((state) => state.setSideIndex);
  const sideIndex = useStoreItems((state) => state.sideIndex);

  // Checks if preview mode variable
  const isPreviewing = usePreviewMode((state) => state.isPreviewing);
  const setPreviewMode = usePreviewMode((state) => state.setPreviewMode);
  const setPanelHandler = useDesignPanelHandler(
    (state) => state.setDesignPanel
  );

  // Ensures to get a loader and not a final preview at the begining of the render
  useEffect(() => {
    setFinalPreview("");
    setProcessedSide(0);
    sideIndexChanger(0);
    setPanelHandler(false);
    setSteps({
      step: 0,
      message: "",
    });
  }, [isPreviewing]);

  // Update the state with final preview images
  const updateFinalPreviews = (dataUrl) => {
    setFinalPreview((prevPreviews) => [...prevPreviews, dataUrl]);
  };

  useEffect(() => {
    const previewMode = async () => {
      // It means that its the begining of the process and the user has set a diferent sideIndex manually, so it changes to 0

      //SE DEBE CAMBIAR ESTO, PARA QUE EL USUARIO TENGA QUE IR AL INDEX 0 (PRIMERA TAB) PARA PODER PROCESAR LAS COSAS.
      //PARA AMBOS PREVIEWMODE Y SAVEMODE

      if (processedSide < 1 && sideIndex > 0) sideIndexChanger(0);
      if (processedSide < product.editor.sides.length) {
        setLoading(true);
        const imgId = uuidv4();
        try {
          const dataUrl = await toPng(workflowRef?.current, {
            cacheBust: true,
          });

          const imageBuffer = Buffer.from(
            dataUrl.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          );

          let command = new PutObjectCommand({
            Bucket: "impretion",
            Key: `temp/${imgId}.png`,
            Body: imageBuffer,
          });

          await awsS3()
            .send(command)
            .then(async () => {
              setImageUrl(
                `https://xyzstorage.store/impretion/temp/${imgId}.png`
              );
            });
        } catch (error) {
          console.error("Error in userProductPreview:", error);
        }
      }
    };

    if (isPreviewing) previewMode();
  }, [isPreviewing, processedSide, sideIndexChanger]);

  // imageUrl as parameter makes sure to execute the useEffect when the image is already loaded by the user avoiding possible bugs.
  useEffect(() => {
    if (imageUrl.length > 0 && product) {
      if (!iframeRef.current) return;
      const photopea = iframeRef.current.contentWindow;
      const scripts = [
        `
        app.echoToOE("PREVIEWMODE");
        app.open("${product?.editor?.sides[sideIndex]?.psdUrl}", null, false)
        `,
        `
        function openSmartObjectContentsAddImageAndSave(smartObjectLayer) {
          if (!smartObjectLayer || smartObjectLayer.kind !== LayerKind.SMARTOBJECT) {
            return;
          }
        
          // Select the Smart Object layer
          app.activeDocument.activeLayer = smartObjectLayer;
        
          // Execute the "Edit Contents" command to open the Smart Object
          var idEditContents = stringIDToTypeID("placedLayerEditContents");
          var desc = new ActionDescriptor();
          executeAction(idEditContents, desc, DialogModes.NO);
        }

        try {
          var activeDoc = app.activeDocument;
          var foundLayerWithHash = false; // Flag to track if layers with "#" are found
          
          // Loop through all layers in the document
          for (var i = 0; i < activeDoc.layers.length; i++) {
            var layer = activeDoc.layers[i];
            // Check if the layer name starts with "#"
            if (layer.name.startsWith("#${product?.editor?.sides[sideIndex]?.sideType}")) {
              app.echoToOE("PREVIEWMODE");
              foundLayerWithHash = true; // Set the flag to true if "#" layer is found
              // Call the function to open and edit the contents of the Smart Object layer
              openSmartObjectContentsAddImageAndSave(layer);
            }
          }
          
          if (!foundLayerWithHash) {
            app.echoToOE("mainLayerError"); // Execute the error message if no "#" layers are found
          }
        } catch (e) {
          alert("An error occurred: " + e);
        }        
        `,
        `
        app.echoToOE("PREVIEWMODE");
        app.open("${imageUrl}", null, true) 
        `,
        `
        var activeDoc = app.activeDocument;

        // Delete layers with a "!" in their name except the newly added layer
        var newLayerIndex = app.activeDocument.activeLayer.itemIndex;
        var placeholderLayerFound = false; // Track if the "!placeholder" layer is found

        for (var i = app.activeDocument.layers.length - 1; i >= 0; i--) {
          var currentLayer = app.activeDocument.layers[i];
          if (i !== newLayerIndex && currentLayer.name.includes("!")) {
          currentLayer.remove();
          }

          // Check if the current layer is the "!placeholder" layer
          if (currentLayer.name === "!placeholder") {
            app.echoToOE("PREVIEWMODE");
            placeholderLayerFound = true;
          }
        }

        // If the "!placeholder" layer is not found, display a message
        if (!placeholderLayerFound) {
          app.echoToOE("placeholderLayerError");
        } else {
        // Rename the current layer to "!placeholder"
        app.activeDocument.activeLayer.name = "!placeholder";

          app.activeDocument.save();
          app.activeDocument.close(SaveOptions.SAVECHANGES);
          app.activeDocument.saveToOE("PNG");
        }
        `,
      ];

      const executeNextScript = (scriptIndex) => {
        if (scriptIndex >= scripts.length) {
          // All scripts executed successfully
          return;
        }
        const script = scripts[scriptIndex];
        setSteps({
          ...steps,
          step: scriptIndex,
        });

        const messageHandler = (e) => {
          // Placeholder layer not found.
          if (e.data === "placeholderLayerError") {
            window.removeEventListener("message", messageHandler);
            setLoading(false);
            setPreviewMode(false);
            alert(
              "Ha ocurrido un error, no se ha podido encontrar la capa de reemplazo."
            );
            return;
          }

          // When main layer (#) is not found.
          if (e.data === "mainLayerError") {
            window.removeEventListener("message", messageHandler);
            setLoading(false);
            setPreviewMode(false);
            alert(
              "Ha ocurrido un error, no se ha podido encontrar la capa principal."
            );
            return;
          }

          if (
            (e.origin === "https://www.photopea.com" && e.data === "done") ||
            e.data instanceof ArrayBuffer ||
            e.data === "PREVIEWMODE"
          ) {
            // Script execution completed, move to the next script
            window.removeEventListener("message", messageHandler);
            setTimeout(
              () => {
                executeNextScript(scriptIndex + 1);
              },
              scriptIndex === 0 || scriptIndex === 2 ? 1700 : 1000
            );
          } else {
            window.removeEventListener("message", messageHandler);
            setLoading(false);
            setPreviewMode(false);
            alert("Ha ocurrido un error inesperado.");
            return;
          }
        };

        window.addEventListener("message", messageHandler);
        photopea.postMessage(script, "*");
      };
      // Clear any existing event listeners before starting
      window.removeEventListener("message", executeNextScript);

      executeNextScript(0);
    }
  }, [imageUrl]);

  useEffect(() => {
    // Update the screenWidth state when the window is resized
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        // Clean up the event listener on unmount
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    // Update the divisorNumber based on screen width
    if (screenWidth > 1350) {
      setDivisorNumber(1);
    } else if (screenWidth <= 1350 && screenWidth > 1300) {
      setDivisorNumber(1.1);
    } else if (screenWidth <= 1300 && screenWidth > 1250) {
      setDivisorNumber(1.2);
    } else if (screenWidth <= 1250 && screenWidth > 1200) {
      setDivisorNumber(1.3);
    } else if (screenWidth <= 1200 && screenWidth > 1100) {
      setDivisorNumber(1.4);
    } else if (screenWidth <= 1100 && screenWidth > 1000) {
      setDivisorNumber(1.1);
    } else if (screenWidth <= 1000 && screenWidth > 900) {
      setDivisorNumber(1.2);
    } else if (screenWidth <= 900 && screenWidth > 850) {
      setDivisorNumber(1.3);
    } else if (screenWidth <= 850 && screenWidth > 800) {
      setDivisorNumber(1.4);
    } else if (screenWidth <= 800 && screenWidth > 760) {
      setDivisorNumber(1.4);
    } else if (screenWidth <= 760 && screenWidth > 700) {
      setDivisorNumber(1.5);
    } else if (screenWidth <= 700 && screenWidth > 660) {
      setDivisorNumber(1.6);
    } else if (screenWidth <= 660 && screenWidth > 615) {
      setDivisorNumber(1.7);
    } else if (screenWidth <= 615 && screenWidth > 590) {
      setDivisorNumber(1.8);
    } else if (screenWidth <= 590 && screenWidth > 560) {
      setDivisorNumber(1.9);
    } else if (screenWidth <= 560 && screenWidth > 520) {
      setDivisorNumber(2.0);
    } else if (screenWidth <= 520 && screenWidth > 490) {
      setDivisorNumber(2.1);
    } else if (screenWidth <= 490 && screenWidth > 460) {
      setDivisorNumber(2.2);
    } else if (screenWidth <= 460 && screenWidth > 440) {
      setDivisorNumber(2.5);
    } else if (screenWidth <= 440 && screenWidth > 420) {
      setDivisorNumber(2.6);
    } else if (screenWidth <= 420 && screenWidth > 400) {
      setDivisorNumber(2.7);
    } else if (screenWidth <= 400 && screenWidth > 370) {
      setDivisorNumber(2.8);
    } else if (screenWidth <= 370 && screenWidth > 350) {
      setDivisorNumber(3);
    } else if (screenWidth <= 350 && screenWidth > 330) {
      setDivisorNumber(3.3);
    } else if (screenWidth <= 330 && screenWidth > 300) {
      setDivisorNumber(3.5);
    } else if (screenWidth <= 300 && screenWidth > 280) {
      setDivisorNumber(3.7);
    } else if (screenWidth <= 280 && screenWidth > 260) {
      setDivisorNumber(3.8);
    } else if (screenWidth <= 260 && screenWidth > 240) {
      setDivisorNumber(3.9);
    } else if (screenWidth <= 240 && screenWidth > 220) {
      setDivisorNumber(4);
    } else {
      setDivisorNumber(4.1); // Fallback value for smaller screens
    }
  }, [screenWidth]);

  useEffect(() => {
    const messageHandler = (e) => {
      if (
        (e.origin === "https://www.photopea.com" &&
          e.data instanceof ArrayBuffer) ||
        e.data === "PREVIEWMODE"
      ) {
        const receivedData = e.data;
        // Check if the received data is an ArrayBuffer
        if (receivedData instanceof ArrayBuffer) {
          const mimeType = "image/png";
          const dataUrl = arrayBufferToDataURL(receivedData, mimeType);
          console.log(dataUrl);
          updateFinalPreviews(dataUrl); // Store the final preview image
          setProcessedSide(processedSide + 1);
          sideIndexChanger(processedSide + 1);
          setLoading(false);
        }
      }
    };

    window.addEventListener("message", messageHandler);

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  const closePreview = () => {
    setPreviewMode(false);
    setFinalPreview("");
  };

  return (
    <>
      <div style={{ width: "20%", height: "20%" }}>
        {isPreviewing && !loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "5px",
              width: "100vw",
            }}
          >
            <button className={styles.outOfPreviewBtn} onClick={closePreview}>
              <AiOutlineArrowLeft />
              Salir de la previsualización
            </button>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${
              product?.editor?.sides[sideIndex]?.width / divisorNumber
            }px`, // editor width and height
            height: `${
              product?.editor?.sides[sideIndex]?.height / divisorNumber
            }px`,
            backgroundColor: "#fff",
          }}
        >
          <>
            {isPreviewing ? (
              <div className={styles.modalContainer}>
                <div className={styles.modalContent}>
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "80%", // Use a percentage for width
                      maxWidth: `${screenWidth * 1}px`, // Dynamically set maxWidth based on screenWidth
                      height: "80%", // Use a percentage for height
                      maxHeight: `${screenWidth * 1}px`, // Dynamically set maxHeight based on screenWidth
                      backgroundColor: "#fff",
                    }}
                  >
                    {finalPreview.length > 0 && (
                      <div className={styles.imageContainer}>
                        <ImageCarousel
                          imageArray={finalPreview}
                          styles={{
                            imagesCSS: {
                              maxWidth: "100%",
                              maxHeight: "100%",
                            },
                            sliderCSS: {
                              nextImageCSS: {
                                position: "absolute",
                                top: 0,
                                right: 0,
                                margin: "1%",
                                padding: "0.5%",
                                border: "none",
                                borderRadius: "4px",
                                color: "#fff",
                                fontWeight: "600",
                                outline: "none",
                                fontSize: "2%",
                                backgroundColor: "rgba(61, 61, 61, 0.55)",
                                height: "98%", // Adjust to your needs
                                cursor: "pointer",
                              },
                              previousImageCSS: {
                                position: "absolute",
                                top: 0,
                                margin: "1%",
                                padding: "0.5%",
                                border: "none",
                                borderRadius: "4px",
                                color: "#fff",
                                fontWeight: "600",
                                outline: "none",
                                fontSize: "2%",
                                backgroundColor: "rgba(61, 61, 61, 0.55)",
                                height: "98%", // Adjust to your needs
                                cursor: "pointer",
                              },
                            },
                          }}
                        ></ImageCarousel>
                      </div>
                    )}
                  </div>

                  {loading && (
                    <div className={styles.loadingContainer}>
                      <CommonLoader />
                      <p style={{ fontSize: "22px" }}>Paso: {steps.step}/3</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Image
                src={product?.editor?.sides[sideIndex]?.templateUrl} // template url
                width={
                  product?.editor?.sides[sideIndex]?.templateWidth /
                  divisorNumber
                }
                height={
                  product?.editor?.sides[sideIndex]?.templateHeight /
                  divisorNumber
                }
                style={{
                  position: "absolute",
                  zIndex: "999999",
                  pointerEvents: "none",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
            <div
              className="workflow"
              ref={workflowRef} // Assign the ref to the div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: "transparent",
                display: "flex", // Set display to flex
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {children}
            </div>
          </>
          <iframe
            ref={iframeRef}
            src="https://www.photopea.com"
            style={{ width: "100%", height: "100%", display: "none" }}
          />
        </div>
      </div>
    </>
  );
}

function arrayBufferToDataURL(arrayBuffer, mimeType) {
  const blob = new Blob([arrayBuffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  return url;
}
