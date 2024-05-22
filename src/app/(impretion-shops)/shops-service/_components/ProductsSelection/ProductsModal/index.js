"use client";

import awsS3 from "@/app/_lib/aws";
import { ListObjectsCommand } from "@aws-sdk/client-s3";
import { getCookie } from "cookies-next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaToolbox } from "react-icons/fa";
import CustomizeAndSelectProduct from "../CustomizeProduct";
import { useShopServicesUserData } from "@/app/_store";

export default function ProductsModal() {
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [currentSelectedProduct, setCurrentSelectedProduct] = useState("");
  const { setOrderData, orderData } = useShopServicesUserData();
  const clientSession = getCookie("clientSession");

  /*
  useEffect(() => {
    // Set overflow to hidden when the component mounts
    document.body.style.overflow = "hidden";

    // Cleanup function to remove overflow when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
   */

  /*
    WORKING ON THIS...
    useEffect(() => {
        const input = { // ListObjectsRequest
          Bucket: "impretion", // required
          Prefix: "pre-designs"
        };
        const command = new ListObjectsCommand(input);
        const response = awsS3().send(command).then((res) => console.log("inside then: ", res));
    }, [])
     */

  const productSelectionHandler = (product) => {
    setCurrentSelectedProduct(product);
  };

  useEffect(() => {
    console.log("irda: ", orderData);
  }, [orderData]);

  return (
    <>
      {showProductsModal ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#fff",
            zIndex: 99999999999,
            padding: "10px",
            overflowY: "auto",
          }}
        >
          <button
            onClick={() => setShowProductsModal(false)}
            style={{ marginBottom: "10px" }}
          >
            CERRAR
          </button>
          <div style={{ border: "1px solid #dedede", height: "150px" }}></div>
          <div
            style={{
              background: "#fff",
              height: "90%",
              overflowY: "auto", // Apply overflow-y: auto to the blue div only
              padding: "10px",
              border: "1px solid #dedede",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                border: "1px solid #dedede",
                borderRadius: "4px",
                display: "flex",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "4px 0px 0px 4px",
                }}
              >
                <Image
                  width={100}
                  height={100}
                  objectFit="cover"
                  src={
                    "https://xyzstorage.store/products%2Fmugs%2F64ef87cba6fe6b117e7aaab6%2Fpreviews%2Fmug(v2).png"
                  }
                ></Image>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "11px" }}>Taza de cerámica 325 ml</p>
                <p style={{ margin: "5px" }}>15.500 COP</p>
                <CustomizeAndSelectProduct
                  selectedProduct={"mug"}
                  productPSDFile={"test.psd"}
                  productURL={"mug"}
                  productImageUrl={
                    "https://xyzstorage.store/products%2Fmugs%2F64ef87cba6fe6b117e7aaab6%2Fpreviews%2Fmug(v2).png"
                  }
                />
              </div>
            </div>

            <div
              style={{
                border: "1px solid #dedede",
                borderRadius: "4px",
                display: "flex",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "4px 0px 0px 4px",
                }}
              >
                <Image
                  width={100}
                  height={100}
                  objectFit="cover"
                  src={
                    "https://xyzstorage.store/products%2Fmugs%2F652e32dfbcfee2bb108da386%2Fpreviews%2Fmagicmug(v1).png"
                  }
                ></Image>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  padding: "10px",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: "11px" }}>
                  Taza de cerámica mágica 325 ml
                </p>
                <p style={{ margin: "5px" }}>15.500 COP</p>
                <CustomizeAndSelectProduct
                  selectedProduct={"mug mágico"}
                  productPSDFile={"test.psd"}
                  productURL={"magic-mug"}
                  productImageUrl={
                    "https://xyzstorage.store/products%2Fmugs%2F652e32dfbcfee2bb108da386%2Fpreviews%2Fmagicmug(v1).png"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          style={{
            background: "#8C52FF",
            border: "none",
            outline: "none",
            padding: "10px",
            borderRadius: "4px",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
          }}
          onClick={() => setShowProductsModal(true)}
        >
          <div>
            <FaToolbox style={{ marginRight: "12px", fontSize: "14px" }} />
          </div>
          <p>Selecciona los artículos...</p>
        </button>
      )}
    </>
  );
}
