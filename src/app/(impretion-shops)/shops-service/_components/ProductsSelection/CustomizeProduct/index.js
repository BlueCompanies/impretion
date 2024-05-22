"use client";

import { useEffect, useState } from "react";
import { FaLocationArrow, FaPlus } from "react-icons/fa";
import dogDesignsArray from "@/app/_lib/shop/designs/dogDesigns.json";
import FieldDescription from "../../../shops/petshop/_components/FieldDescription";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useShopServicesUserData } from "@/app/_store";
import { getCookie } from "cookies-next";
import Image from "next/image";

export default function CustomizeAndSelectProduct({
  selectedProduct,
  productImageUrl,
  productURL,
}) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const { setOrderData, orderData } = useShopServicesUserData();
  const [photopeaString, setPhotopeaString] = useState("");
  const [iframeKey, setIframeKey] = useState(0); // Key to force iframe re-render
  const [newImageUrl, setNewImageUrl] = useState("");
  const [products, setProducts] = useState([
    {
      name: selectedProduct,
      designUrl: "",
      productImageUrl,
      isProductDesigned: false,
      isProductSelected: true,
    },
  ]);

  const addNewProduct = () => {
    setProducts([
      ...products,
      {
        name: selectedProduct,
        designUrl: "",
        productImageUrl,
        isProductDesigned: false,
        isProductSelected: false,
      },
    ]);
  };

  const currentSelectedProduct = (index) => {
    setProducts((prevProduct) => {
      const updatedProduct = prevProduct.map((item, i) => {
        return {
          ...item,
          isProductSelected: i === index,
        };
      });
      return updatedProduct;
    });
  };

  async function handleMessage(event) {
    if (event.data instanceof ArrayBuffer || event.data instanceof Blob) {
      const blob =
        event.data instanceof Blob
          ? event.data
          : new Blob([event.data], { type: "image/png" });

      // Create an object URL for the blob and set it as the new image URL
      const newImageUrl = URL.createObjectURL(blob);
      setNewImageUrl(newImageUrl);

      const formData = new FormData();
      formData.append("image", blob, "image.png");

      // Uncomment the following lines to send the image to your server if needed
      /*
      fetch("https://petshop-product-preview.andres-242001.workers.dev", {
        method: "PUT",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Network response was not ok.");
        })
        .then((data) => {
          // Handle the response data
          console.log(data);
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });
      */
    }
  }

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const assignDesingToProductHandler = async (designId) => {
    const clientSession = getCookie("clientSession");
    const petName = "Sammy";
    const config = {
      files: [
        //`https://xyzstorage.store/WhatsApp%20Image%202024-05-21%20at%207.44.04%20PM.jpeg`,
        "https://xyzstorage.store/fotos-mascotas-1.jpg",
        `https://xyzstorage.store/impretion-shops/psd-designs/${productURL}/${designId}.psd`,
      ],
      script:
        "function openSmartObjectContents(smartObjectLayer) { if (!smartObjectLayer || smartObjectLayer.kind !== LayerKind.SMARTOBJECT) { return; } if (smartObjectLayer.name.startsWith('#')) { var docRef = app.activeDocument; docRef.activeLayer = smartObjectLayer; var idEditContents = stringIDToTypeID('placedLayerEditContents'); var desc = new ActionDescriptor(); executeAction(idEditContents, desc, DialogModes.NO); app.activeDocument.paste(); var newLayer = app.activeDocument.activeLayer; var smartObjectWidth = app.activeDocument.width; var smartObjectHeight = app.activeDocument.height; var newLayerWidth = newLayer.bounds[2] - newLayer.bounds[0]; var newLayerHeight = newLayer.bounds[3] - newLayer.bounds[1]; var widthScale = (smartObjectWidth / newLayerWidth) * 100; newLayer.resize(widthScale, widthScale, AnchorPosition.MIDDLECENTER); newLayerHeight = newLayer.bounds[3] - newLayer.bounds[1]; if (newLayerHeight < smartObjectHeight) { var heightScale = (smartObjectHeight / newLayerHeight) * 100; newLayer.resize(heightScale, heightScale, AnchorPosition.MIDDLECENTER); } newLayer.translate((smartObjectWidth - (newLayer.bounds[2] - newLayer.bounds[0])) / 2 - newLayer.bounds[0], (smartObjectHeight - (newLayer.bounds[3] - newLayer.bounds[1])) / 2 - newLayer.bounds[1]); var placeholderLayerFound = false; for (var i = app.activeDocument.layers.length - 1; i >= 0; i--) { var currentLayer = app.activeDocument.layers[i]; if (currentLayer !== newLayer && currentLayer.name.includes('!')) { currentLayer.remove(); } if (currentLayer.name === '!placeholder') { placeholderLayerFound = true; } } if (!placeholderLayerFound) { app.echoToOE('placeholderLayerError'); } else { newLayer.name = '!placeholder'; app.activeDocument.save(); app.activeDocument.close(SaveOptions.SAVECHANGES); } } } function processActiveDocument() { var doc = app.activeDocument; try { var layer = doc.layers.getByName('$petNamePlaceholder'); if (layer && layer.kind === LayerKind.TEXT) { layer.textItem.contents = '" +
        petName +
        "'; layer.textItem.justification = Justification.CENTER; } } catch (e) {} if (app.documents.length === 1) { var firstLayer = doc.layers[0]; doc.activeLayer = firstLayer; firstLayer.copy(); } for (var j = 0; j < doc.layers.length; j++) { var layer = doc.layers[j]; openSmartObjectContents(layer); } if (app.documents.length !== 1) { doc.saveToOE('png'); } } processActiveDocument();",
    };

    const configString = JSON.stringify(config);
    const encodedConfig = encodeURIComponent(configString);

    /*
    Script con imagenes dejando derecha e izquierda vacios.
    script:
        "function openSmartObjectContents(smartObjectLayer) { if (!smartObjectLayer || smartObjectLayer.kind !== LayerKind.SMARTOBJECT) { return; } if (smartObjectLayer.name.startsWith('#')) { var docRef = app.activeDocument; docRef.activeLayer = smartObjectLayer; var idEditContents = stringIDToTypeID('placedLayerEditContents'); var desc = new ActionDescriptor(); executeAction(idEditContents, desc, DialogModes.NO); app.activeDocument.paste(); var newLayer = app.activeDocument.activeLayer; var smartObjectWidth = app.activeDocument.width; var smartObjectHeight = app.activeDocument.height; var newLayerWidth = newLayer.bounds[2] - newLayer.bounds[0]; var newLayerHeight = newLayer.bounds[3] - newLayer.bounds[1]; var aspectRatio = newLayerWidth / newLayerHeight; var canvasAspectRatio = smartObjectWidth / smartObjectHeight; var targetWidth, targetHeight; if (aspectRatio > canvasAspectRatio) { targetWidth = smartObjectWidth; targetHeight = targetWidth / aspectRatio; } else { targetHeight = smartObjectHeight; targetWidth = targetHeight * aspectRatio; } var widthScale = (targetWidth / newLayerWidth) * 100; var heightScale = (targetHeight / newLayerHeight) * 100; newLayer.resize(widthScale, heightScale, AnchorPosition.MIDDLECENTER); newLayer.translate( (smartObjectWidth - (newLayer.bounds[2] - newLayer.bounds[0])) / 2 - newLayer.bounds[0], (smartObjectHeight - (newLayer.bounds[3] - newLayer.bounds[1])) / 2 - newLayer.bounds[1] ); var placeholderLayerFound = false; for (var i = app.activeDocument.layers.length - 1; i >= 0; i--) { var currentLayer = app.activeDocument.layers[i]; if (currentLayer !== newLayer && currentLayer.name.includes('!')) { currentLayer.remove(); } if (currentLayer.name === '!placeholder') { placeholderLayerFound = true; } } if (!placeholderLayerFound) { app.echoToOE('placeholderLayerError'); } else { newLayer.name = '!placeholder'; app.activeDocument.save(); app.activeDocument.close(SaveOptions.SAVECHANGES); } } } function processActiveDocument() { var doc = app.activeDocument; try { var layer = doc.layers.getByName('$petNamePlaceholder'); if (layer && layer.kind === LayerKind.TEXT) { layer.textItem.contents = '" +
        petName +
        "'; layer.textItem.justification = Justification.CENTER; } } catch (e) {} if (app.documents.length === 1) { var firstLayer = doc.layers[0]; doc.activeLayer = firstLayer; firstLayer.copy(); } for (var j = 0; j < doc.layers.length; j++) { var layer = doc.layers[j]; openSmartObjectContents(layer); } if (app.documents.length !== 1) { doc.saveToOE('png'); } } processActiveDocument();",
    */

    setPhotopeaString(encodedConfig);
    setIframeKey(Date.now()); // Update iframe key to force re-render
  };

  const noDesingToProductHandler = () => {
    setProducts((prevProduct) => {
      const updatedProduct = prevProduct.map((item) => {
        if (item.isProductSelected) {
          return {
            ...item,
            designUrl: "/shops/images/no-design.webp",
            isProductDesigned: true,
          };
        } else {
          return item;
        }
      });
      return updatedProduct;
    });
  };

  const removeProduct = (index) => {
    setProducts((prevProduct) => {
      const updatedProduct = prevProduct.filter((_, i) => i !== index);
      return updatedProduct;
    });
  };

  const closeCustomizingModalHandler = () => {
    const isActivePet = orderData.petData.find((pet) => pet.isActive === true);
    if (isActivePet) {
      const isActiveId = isActivePet.id.toString();

      const updatedOrderData = { ...orderData };

      if (!updatedOrderData.orderDetails) {
        updatedOrderData.orderDetails = [];
      }

      const existingIndex = updatedOrderData.orderDetails.findIndex(
        (item) => Object.keys(item)[0] === isActiveId
      );

      if (existingIndex !== -1) {
        updatedOrderData.orderDetails[existingIndex][isActiveId] = {
          ...updatedOrderData.orderDetails[existingIndex][isActiveId],
          [selectedProduct]: products,
        };
      } else {
        const newOrderDetail = {
          [isActiveId]: { [selectedProduct]: products },
        };
        updatedOrderData.orderDetails.push(newOrderDetail);
      }

      setOrderData(updatedOrderData);
    }

    setIsCustomizing(false);
  };

  return (
    <>
      {photopeaString && (
        <iframe
          key={iframeKey} // Use the key to force re-render
          src={`https://www.photopea.com#${photopeaString}`}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: 99999999999999999999999999,
            display: "none",
          }}
        ></iframe>
      )}

      {isCustomizing && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            background: "#fff",
            zIndex: 99999999999,
            overflow: "auto",
            width: "100vw",
          }}
        >
          <FieldDescription>
            Asegúrate de asignarle un diseño a cada {selectedProduct} que
            agregues. Ningún producto puede quedar "sin diseño".
          </FieldDescription>
          <div
            style={{ display: "flex", marginBottom: "5px", padding: "10px" }}
          >
            <div
              style={{
                minWidth: "60px",
                minHeight: "60px",
                background: "#00EA9D",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "4px",
                flexDirection: "column",
                border: "1px solid green",
              }}
              onClick={addNewProduct}
            >
              <FaPlus style={{ color: "green", margin: "2px" }} />
            </div>
          </div>

          <div
            style={{
              margin: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src={
                newImageUrl ||
                "https://xyzstorage.store/impretion-shops%2Fproducts-placeholder%2Fmug-placeholder.png"
              }
              width={250}
              height={250}
            ></Image>
          </div>

          <div
            style={{
              border: "1px solid #dedede",
              height: "55%",
              borderRadius: "4px",
              padding: "10px",
              margin: "10px",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100px",
                border: "1px dashed #555555",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#555555",
                flexDirection: "column",
                fontSize: "12px",
                background: "#E8E8E8",
              }}
              onClick={noDesingToProductHandler}
            >
              <p style={{ fontWeight: 700 }}>¿No te gusto ningun diseño?</p>
              <p>¡te haremos uno que se ajuste a tus gustos!</p>
            </div>
            <div
              style={{
                width: "100%",
              }}
            >
              <div>
                {dogDesignsArray.dogDesigns.map((design, index) => (
                  <img
                    src={design.designUrl}
                    onClick={() =>
                      assignDesingToProductHandler(design.designId)
                    }
                    style={{
                      width: "100%",
                      height: "135px",
                      marginTop: "3px",
                      borderRadius: "4px",
                      objectFit: "cover",
                    }}
                    key={index}
                  ></img>
                ))}
              </div>
            </div>
          </div>
          <div style={{ height: "30px", width: "100%" }}></div>

          <div
            style={{
              position: "fixed",
              bottom: 1,
              marginTop: "70px",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "100%",
              }}
            ></div>
            <div style={{ display: "flex" }}>
              <button
                onClick={() => closeCustomizingModalHandler()}
                style={{
                  height: "40px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  margin: "auto",
                  justifyContent: "center",
                  border: "none",
                  outline: "none",
                  background: "#8C52FF",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    marginRight: "15px",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FaArrowLeftLong />
                </div>
                <p>Volver</p>
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", width: "100%" }}>
        <button
          style={{
            margin: "2px",
            fontSize: "11px",
            width: "100%",
            border: "none",
            borderRadius: "4px",
            padding: "4px",
            border: "1px solid green",
            background: "#C8FFB0",
          }}
          onClick={() => setIsCustomizing(true)}
        >
          Seleccionar y personalizar
        </button>
      </div>
    </>
  );
}
