import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import {
  useDesignPanelHandler,
  useGeneratedMockups,
  usePreviewMode,
  useStoreItems,
  useWorkFlowSize,
} from "@/app/_store";
import { toPng } from "html-to-image";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Image from "next/image";
import awsS3 from "@/app/_lib/aws";
import GenericLoader from "@/app/_components/Loaders/MockupGeneratedLoader";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function ProductDesign({ product, children }) {
  const workflowRef = useRef(null); // Add a ref for the workflow div
  const [loading, setLoading] = useState(false);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [divisorNumber, setDivisorNumber] = useState(1);
  const [steps, setSteps] = useState({
    step: 0,
    message: "",
  });

  // used variables
  const photopeaRef = useRef(null);
  const sideIndexChanger = useStoreItems((state) => state.setSideIndex);
  const sideIndex = useStoreItems((state) => state.sideIndex);
  const generatedMockups = useGeneratedMockups((state) => state.mockups);
  const setGeneratedMockups = useGeneratedMockups((state) => state.setMockups);
  const setGeneratedMockupsLength = useGeneratedMockups(
    (state) => state.setMockupsLength
  );
  const resetGeneratedMockups = useGeneratedMockups(
    (state) => state.resetMockups
  );
  const currentMockupImage = useGeneratedMockups(
    (state) => state.currentMockupImage
  );
  const setCurrentMockupImage = useGeneratedMockups(
    (state) => state.setCurrentMockupImage
  );
  const setWorkflowSize = useWorkFlowSize((state) => state.setSizes);

  const [imagesUrl, setImagesUrl] = useState([]);
  const [openedDocuments, setOpenedDocuments] = useState(0);
  const [currentDocument, setCurrentDocument] = useState(0);
  const [photopeaString, setPhotopeaString] = useState("");
  const [isCanceled, setIsCanceled] = useState(false);
  const [finalPreview, setFinalPreview] = useState([]);

  // Checks if preview mode variable
  const isPreviewing = usePreviewMode((state) => state.isPreviewing);
  const setPreviewMode = usePreviewMode((state) => state.setPreviewMode);
  const setPanelHandler = useDesignPanelHandler(
    (state) => state.setDesignPanel
  );

  useEffect(() => {
    if (product) {
      const stringTemplate = `{"files":[${product?.editor?.mockups?.modelMockups
        .map((mockup) => `"${mockup.psdUrl}"`)
        .join(
          ","
        )}], "environment":{"localsave":false,"autosave":99999999,"menus":[],"panels":[]}}`;
      const encodedString = encodeURIComponent(stringTemplate);
      setPhotopeaString(encodedString);
    }
  }, [product]);

  // Photopea event handler
  useEffect(() => {
    const handleMessage = (event) => {
      if (!photopeaRef.current) return;
      if (event.data instanceof ArrayBuffer) {
        const mimeType = "image/png";
        const dataUrl = arrayBufferToDataURL(event.data, mimeType);
        setGeneratedMockups(dataUrl);
      }

      if (event.data === "canceled") {
        alert("Proceso cancelado!");
      }

      if (typeof event.data === "number") {
        setOpenedDocuments(event.data);
      }
    };

    // Add event listener to listen for messages from Photopea
    window.addEventListener("message", handleMessage);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const previewMode = async () => {
      setGeneratedMockupsLength(product.editor.mockups.modelMockups.length);

      // Loading handler, ensures that the loading stops when generatedMockups is not empty anymore.
      if (generatedMockups.length <= 0) {
        setLoading(true);
      } else {
        setLoading(false);
      }

      if (sideIndex < product.editor.sides.length) {
        const imgId = uuidv4();

        try {
          setTimeout(async () => {
            const dataUrl = await toPng(workflowRef?.current, {
              cacheBust: true,
            });
            console.log(dataUrl);
            const imageBuffer = Buffer.from(
              dataUrl.replace(/^data:image\/\w+;base64,/, ""),
              "base64"
            );
            console.log("fuikiti: ", imageBuffer);
            let command = new PutObjectCommand({
              Bucket: "impretion",
              Key: `temp-files/temp-user-raw-designs/${imgId}.png`,
              Body: imageBuffer,
            });

            await awsS3().send(command);

            setImagesUrl((prevImgs) => [
              ...prevImgs,
              {
                imageUrl: `https://xyzstorage.store/temp-files/temp-user-raw-designs/${imgId}.png`,
                side: product.editor.sides[sideIndex].sideType,
              },
            ]);
            sideIndexChanger(sideIndex + 1);
          }, 100);
        } catch (error) {
          console.error("Error in userProductPreview:", error);
        }
      }
    };

    if (isPreviewing) previewMode();
  }, [isPreviewing, sideIndex, generatedMockups]);

  useEffect(() => {
    console.log("i em gi: ", imagesUrl);
  }, [imagesUrl]);

  useEffect(() => {
    console.log(imagesUrl, product.editor.sides.length);
    if (imagesUrl.length >= product.editor.sides.length) {
      const wnd = photopeaRef.current.contentWindow;
      const PSDMockups = product.editor.mockups.modelMockups;

      let rawImage;
      if (imagesUrl.length > 1) {
        rawImage = imagesUrl.find(
          (image) => PSDMockups[currentDocument]?.sideType === image?.side
        );
      } else {
        rawImage = imagesUrl[0];
      }

      if (currentDocument < openedDocuments) {
        const scripts = [
          `
          try {
            var documentIndex = ${currentDocument};
            app.activeDocument = app.documents[documentIndex];
            var docRef = app.activeDocument;
            
            function openSmartObjectContents(smartObjectLayer) {
                if (!smartObjectLayer || smartObjectLayer.kind !== LayerKind.SMARTOBJECT) {
                    return;
                }
                if (smartObjectLayer.name.startsWith("#")) { // Check if the name starts with "#"
                    docRef.activeLayer = smartObjectLayer;
                    var idEditContents = stringIDToTypeID("placedLayerEditContents");
                    var desc = new ActionDescriptor();
                    executeAction(idEditContents, desc, DialogModes.NO);
                }
            }
            
            for (var j = 0; j < docRef.layers.length; j++) {
                var layer = docRef.layers[j];
                openSmartObjectContents(layer);
            }
            } catch (e) {
                alert("An error occurred: " + e);
            }
        
              `,
          `app.open("${rawImage?.imageUrl}", null, true)`,
          `
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
          }
          `,
          `
          app.activeDocument = app.documents[${currentDocument}];
          var doc = app.activeDocument
          alert(doc.layers.length)
          doc.saveToOE("PNG");
          `,
        ];

        const executeNextScript = (scriptIndex, callback) => {
          if (scriptIndex === scripts.length) {
            callback(); // Call the callback once all scripts are executed
            return;
          }
          wnd.postMessage(scripts[scriptIndex], "*"); // Execute the current script
          setTimeout(
            () => executeNextScript(scriptIndex + 1, callback),
            scriptIndex === 1 ? 1500 : 100
          ); // Schedule the next script after a delay
        };

        // Start executing the scripts
        executeNextScript(0, () => setCurrentDocument(currentDocument + 1));
      }
    }
  }, [imagesUrl, currentDocument]);

  /*
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
          var docRef = app.documents[0];
          var activeDoc = docRef;
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
 

  
  */
  // imageUrl as parameter makes sure to execute the useEffect when the image is already loaded by the user avoiding possible bugs.

  /*
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
   */

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
    if (isPreviewing) {
      if (!photopeaRef || !photopeaRef.current) return; // Check if photopeaRef or photopeaRef.current is null/undefined
      const wnd = photopeaRef.current.contentWindow;
      if (!wnd) return; // Check if contentWindow is null/undefined
      setCurrentDocument(0);
      setImagesUrl([]);
      wnd.postMessage("app.echoToOE(app.documents.length)", "*");
    } else {
      setPreviewMode(false);
      setFinalPreview("");
      resetGeneratedMockups();
      setGeneratedMockupsLength(0);
      setCurrentMockupImage("");
      sideIndexChanger(0);
      setPanelHandler(false);
    }
  }, [isPreviewing]);

  // Ensures that all objects shrink depending on the board's size
  useEffect(() => {
    setWorkflowSize({
      width: product?.editor?.sides[sideIndex]?.width / divisorNumber,
      height: product?.editor?.sides[sideIndex]?.height / divisorNumber,
    });
  }, [divisorNumber]);

  return (
    <>
      <div>
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
            overflow: "hidden", // Hide content that overflows the container
          }}
        >
          {isPreviewing && (
            <>
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
                    {currentMockupImage.length > 0 && (
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        src={currentMockupImage}
                      ></img>
                    )}
                    {loading && (
                      <div className={styles.loadingContainer}>
                        <GenericLoader />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
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
        </div>
        {!isPreviewing && (
          <Image
            src={product?.editor?.sides[sideIndex]?.templateUrl} // template url
            width={
              product?.editor?.sides[sideIndex]?.templateWidth / divisorNumber
            }
            height={
              product?.editor?.sides[sideIndex]?.templateHeight / divisorNumber
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
        {photopeaString && (
          <iframe
            ref={photopeaRef}
            src={`https://www.photopea.com#${photopeaString}`}
            style={{ width: "100%", height: "100%", display: "none" }}
          />
        )}
      </div>
    </>
  );
}

function arrayBufferToDataURL(arrayBuffer, mimeType) {
  const blob = new Blob([arrayBuffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  return url;
}
