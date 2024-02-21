"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { v4 as uuidv4 } from "uuid";
import colombiaStates from "@/app/_lib/colombiaStates";
import { BsFillCartFill } from "react-icons/bs";
import { toPng } from "html-to-image";
import md5 from "md5";
import { useOrderFormSent, usePreviewMode, useStoreItems } from "@/app/_store";
import awsS3 from "@/app/_lib/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import CashOnDelivery from "./cashOnDelivery";
import CommonLoader from "@/app/_components/Loaders/CommonLoader";

function BuyModalWindow({ currentProduct }) {
  const formRef = useRef(null);
  const setFormState = useOrderFormSent((state) => state.setFormSubmit);
  const [showModal, setShowModal] = useState(false);
  const isPreviewing = usePreviewMode((state) => state.isPreviewing);
  const [product, setProduct] = useState(null);
  const [fetchedCouriers, setFetchedCouriers] = useState([]);
  const [fetchedProvinces, setFetchedProvinces] = useState({
    originProvinces: {},
    destinationProvinces: {},
  });
  const [shipmentData, setShipmentData] = useState({
    origin: {
      provinceLocation: {
        province: "CALDAS ",
        code: "05129000",
        stateCode: "AN",
      },
    },

    destination: {
      provinceLocation: {
        province: "",
        code: "",
      },
    },

    shipmentProvider: "",
  });
  const [productQuantity, setProductQuantity] = useState(1);
  const [productTotal, setProductTotal] = useState();
  const [discounts, setDiscounts] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [packageBox, setPackageBox] = useState([]);
  const [deliveryWay, setDeliveryWay] = useState("cashOnDelivery");
  const modalHandler = () => {
    sideIndexChanger(0);
    setShowModal(!showModal);
  };
  const [deliveryData, setDeliveryData] = useState([]);
  const [loading, setLoading] = useState({
    loadingDeliveryData: false,
    loadingFetchData: false,
  });
  const [orderLoading, setOrderLoading] = useState(false);
  const [errors, setErrors] = useState({
    selectedCourierError: "",
    apiError: "",
    unknownError: "",
    courierNotAvailable: "",
    provinceNotSelected: "",
    userData: {
      address: "",
      name: "",
      telephone: "",
      email: "",
    },
  });
  const [selectedDelivery, setSelectedDelivery] = useState({});
  const [priceWithDiscount, setPriceWithDiscount] = useState();

  const handleDeliveryChange = (deliveryType) => {
    setSelectedDelivery(deliveryType);
  };

  const [keys, setKeys] = useState({
    signature: "",
    uuid: "",
  });

  const sideIndexChanger = useStoreItems((state) => state.setSideIndex);
  const sideIndex = useStoreItems((state) => state.sideIndex);

  /*
  const handleCourierSelected = (courierName) => {
    setShipmentData({ ...shipmentData, shipmentProvider: courierName });
  };

  
  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const response = await fetch(
          "https://queries-test.envia.com/carrier?country_code=CO",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer c457ce41b0c7b1dab1b1bd7505e8e8e8e63018531ee13cae6fbfe184d9499073",
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setFetchedCouriers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCouriers();
  }, []);
  */

  useEffect(() => {
    if (currentProduct) {
      try {
        console.log("CURRENT P NO PARSED: ", currentProduct);
        const parsedProduct = JSON.parse(currentProduct);
        console.log("parsed P: ", parsedProduct);
        setProduct(parsedProduct);
      } catch (error) {
        console.error("Error parsing currentProduct:", error);
      }
    }
  }, [currentProduct]);

  const getStates = async (state, location) => {
    const stateData = await JSON.parse(state);
    const response = await fetch(
      `https://queries-test.envia.com/provinces/${stateData.code}`
    );

    const data = await response.json();

    // set fetched data depending on the purpose of the location origin/destination
    if (location === "origin") {
      setFetchedProvinces({ ...fetchedProvinces, originProvinces: data });
    }

    if (location === "destination") {
      setFetchedProvinces({ ...fetchedProvinces, destinationProvinces: data });
    }
  };

  const getProvinces = async (province, location) => {
    const provinceData = await JSON.parse(province);
    if (location === "origin") {
      const currentLocationData = { ...shipmentData };
      currentLocationData.origin.provinceLocation = {
        ...currentLocationData.origin.provinceLocation,
        province: provinceData.name,
        code: provinceData.code,
        stateCode: provinceData.stateCode,
      };

      setShipmentData(currentLocationData);
    }

    if (location === "destination") {
      const currentLocationData = { ...shipmentData };
      currentLocationData.destination.provinceLocation = {
        ...currentLocationData.destination.provinceLocation,
        province: provinceData.name,
        code: provinceData.code,
        stateCode: provinceData.stateCode,
      };

      setShipmentData(currentLocationData);
    }
  };

  /*
  const shippingPrice = async () => {
    try {
      if (shipmentData.destination.provinceLocation.province === "") {
        setErrors({
          provinceNotSelected: "Debes llenar todos los datos de envío.",
        });
        setSelectedDelivery({});
        return;
      }
      setLoading({ ...loading, loadingDeliveryData: true });
      const response = await fetch("https://api-test.envia.com/ship/rate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer c457ce41b0c7b1dab1b1bd7505e8e8e8e63018531ee13cae6fbfe184d9499073",
        },
        body: JSON.stringify({
          origin: {
            name: "Colombia test",
            company: "Envia",
            email: "colombia@envia.com",
            phone: "",
            street: "",
            number: "",
            district: "",
            city: shipmentData.origin.provinceLocation.code,
            state: shipmentData.origin.provinceLocation.stateCode,
            country: "CO",
            postalCode: "66236890",
            reference: "",
            identificationNumber: "66236890",
          },
          destination: {
            name: "Colombia test",
            company: "Envia",
            email: "colombia@envia.com",
            phone: "",
            street: "",
            number: "",
            district: "",
            city: shipmentData.destination.provinceLocation.code,
            state: shipmentData.destination.provinceLocation.stateCode,
            country: "CO",
            postalCode: "66236890",
            reference: "",
            identificationNumber: "66236890",
          },
          packages: packageBox,
          shipment: {
            carrier: shipmentData.shipmentProvider,
            type: 1,
          },
          settings: {
            currency: "COP",
          },
        }),
      });
      setLoading({ ...loading, loadingDeliveryData: false });

      if (!response.ok) {
        // Handle non-success response (e.g., status code 4xx or 5xx)
        console.error("Request failed with status:", response.status);
        setDeliveryData([]);
        setSelectedDelivery({});
        // Handle the error as needed
      } else {
        // Parse the JSON response
        const data = await response.json();
        console.log(data);
        if (data.code >= 400) {
          setErrors({
            apiError: "Ha ocurrido un error al calcular el costo del envío.",
          });
          setDeliveryData([]);
          setSelectedDelivery({});
          return;
        }

        if (data?.error?.code === 1125) {
          setErrors({
            courierNotAvailable: `El servicio de ${shipmentData.shipmentProvider} no esta disponible.`,
          });
          setDeliveryData([]);
          setSelectedDelivery({});
          return;
        }

        if (
          data?.error?.message === "No coverage" ||
          data?.error?.code === 1146
        ) {
          setErrors({
            selectedCourierError: `Al parecer ${shipmentData.shipmentProvider} no hace envios a esta zona.`,
          });
          setDeliveryData([]);
          setSelectedDelivery({});
          return;
        }

        if (data?.error) {
          setErrors({
            unknownError: `Parece que hay un problema obteniendo los datos de envio de ${shipmentData.shipmentProvider}, porfavor intenta con una empresa diferente.`,
          });
          setDeliveryData([]);
          setSelectedDelivery({});
          return;
        }

        if (data?.code) {
          setDeliveryData([]);
          setSelectedDelivery({});
          return;
        }

        setDeliveryData(data.data);
        setSelectedDelivery(data.data[0]);
        // default option in the data array (the first one)
        //setDeliveryType(data.data[0]);
        setErrors({
          selectedCourierError: "",
          apiError: "",
          unknownError: "",
        });
        // Handle the JSON data as needed
      }
    } catch (error) {
      setDeliveryData([]);
      // Handle network or other errors
      console.error("An error occurred:", error);
    }
  };
  */

  // PRODUCT SECTION RENDERING:
  useEffect(() => {
    // We make sure to set correctly the product total when the product json is already setted.
    if (product) {
      setProductTotal(product?.productData?.prices?.basePrice);
      setDiscounts(product?.productData?.prices?.discounts);
      setPackageBox([
        {
          content: product.name,
          amount: 1,
          type: "box",
          weight: 1,
          insurance: 0,
          declaredValue: 0,
          weightUnit: "KG",
          lengthUnit: "CM",
          dimensions: {
            length: product.measures?.height?.cm,
            width: product.measures?.width?.cm
              ? product.measures?.width?.cm
              : "",
            height: 0.01,
          },
        },
      ]);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      let price = product?.productData?.prices?.basePrice;
      // Iterate through the discounts array and apply discounts based on quantity
      product?.productData?.prices?.discounts?.forEach((discount) => {
        if (productQuantity >= discount.amount) {
          const discountAmount =
            (product.productData.prices.basePrice * discount.percentage) / 100;
          const totalDiscount =
            product.productData.prices.basePrice - discountAmount;
          setDiscountPercentage(discount.percentage);
          price = totalDiscount;
          discount = discount.percentage;
          setDiscountPercentage(discount);
        }
      });

      if (product?.productData?.prices?.discounts) {
        if (
          productQuantity <
            product?.productData?.prices?.discounts[0]?.amount ||
          0
        ) {
          setDiscountPercentage(0);
        }
      }
      setProductTotal(price * productQuantity);

      /* PRODUCT PACKAGE BOX SYSTEM */
      const packageSize = 15;
      let remainingQuantity = productQuantity;

      // Create a new array to hold the package boxes
      const newPackageBox = [];

      while (remainingQuantity > 0) {
        const currentPackageSize = Math.min(remainingQuantity, packageSize);

        // Create a new object for the current package size
        const newBox = {
          content: product.name,
          type: "box",
          weight:
            product?.measures?.packageMeasures?.weight?.kg * productQuantity,
          insurance: 0,
          declaredValue: 0,
          weightUnit: "KG",
          lengthUnit: "CM",
          dimensions: {
            /*
            length: product.measures?.packageMeasures?.length?.cm,
            width: product?.measures?.packageMeasures?.width?.cm,
            height: product?.measures?.packageMeasures?.height?.cm,
             */
            length: 64,
            width: 80,
            height: 10,
          },
          amount: currentPackageSize,
        };

        // Push the new object to the array
        newPackageBox.push(newBox);

        // Subtract the processed quantity from the remaining quantity
        remainingQuantity -= currentPackageSize;
      }

      // Set the packageBox state to the new array
      setPackageBox(newPackageBox);
      setPriceWithDiscount(price);
      console.log(priceWithDiscount);
    }
  }, [productQuantity]);

  const productQuantityChange = (e) => {
    if (product) {
      setProductQuantity(e.target.value);
    }
  };

  const handleDeliveryWay = (delivery) => {
    setDeliveryWay(delivery);
  };

  const newOrder = async (e, userDeliveryData) => {
    e.preventDefault();
    if (shipmentData.destination.provinceLocation.province === "") {
      setErrors({
        provinceNotSelected: "Selecciona tu provincia.",
      });
      return;
    }

    if (!userDeliveryData.address) {
      setErrors({
        userData: {
          address: "Por favor, pon los datos de tu dirección.",
        },
      });
      return;
    }

    if (!userDeliveryData.name) {
      setErrors({
        userData: {
          name: "Por favor, indícanos a nombre de quién es el envío.",
        },
      });
      return;
    }

    if (!userDeliveryData.telephone) {
      setErrors({
        userData: {
          telephone: "Por favor, indícanos un numero de teléfono de contacto.",
        },
      });
      return;
    }

    if (!userDeliveryData.email) {
      setErrors({
        userData: {
          email: "Por favor, proporciona un correo electrónico de contacto.",
        },
      });
      return;
    }

    if (sideIndex !== 0) {
      sideIndexChanger(0);
    }
    setOrderLoading(true);
    const generatedId = uuidv4();
    const signature = md5(
      `4Vj8eK4rloUd272L48hsrarnUA~508029~${generatedId}~${
        selectedDelivery.basePrice
          ? productTotal + selectedDelivery.basePrice
          : productTotal
      }~COP`
    );

    setKeys({ signature: signature, uuid: generatedId });
    const totalRawImageSides = product?.editor?.sides;
    const rawImageUrls = [];

    const processImagesSequentially = async () => {
      for (
        let currentIndex = 0;
        currentIndex < totalRawImageSides.length;
        currentIndex++
      ) {
        setOrderLoading(true);

        let node = document.querySelector(".workflow");
        const rawImageId = uuidv4();

        const dataUrl = await toPng(node, {
          cacheBust: true,
        });

        const imageBuffer = Buffer.from(
          dataUrl.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );

        const command = new PutObjectCommand({
          Bucket: "impretion",
          Key: `orders/unprocessed-orders/order-${generatedId}/raw-image-${rawImageId}.png`,
          Body: imageBuffer,
        });

        await awsS3().send(command);

        const rawImageUrl = `https://xyzstorage.store/impretion/orders/unprocessed-orders/order-${generatedId}/raw-image-${rawImageId}.png`;
        rawImageUrls.push({
          mockupImage: rawImageUrl,
          sideType: totalRawImageSides[currentIndex]?.sideType,
        });

        // Update sideIndex
        sideIndexChanger(currentIndex + 1);

        // Short delay before the next iteration
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    };
    // Start processing images
    await processImagesSequentially();

    try {
      setFormState(true);
      const response = await fetch("/api/orders/normal-order/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productQuantity: productQuantity,
          productName: product.name,
          productId: product._id,
          rawImagesUrl: rawImageUrls,
          orderReference: generatedId,
          orderType: "normal",
          orderStatus: "UNPROCESSED",
          userData: {
            shipment: shipmentData || "",
            userData: userDeliveryData,
          },
          priceData: {
            basePrice: product?.productData?.prices?.basePrice,
            discountedPrice: priceWithDiscount,
            percentageDiscounted: discountPercentage,
          },
        }),
      });

      if (!response.ok) {
        alert("Ha ocurrido un error al procesar la orden.");
        return;
      }
      if (formRef.current) {
        formRef.current.submit();
      } else {
        alert("No se ha podido enviar el formulario.");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {showModal && (
        <>
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              {deliveryWay === "cashOnDelivery" && (
                <CashOnDelivery
                  productName={product?.name}
                  productBasePrice={product?.productData?.prices?.basePrice}
                  productTotal={productTotal}
                  setProductTotal={setProductTotal}
                  productQuantity={productQuantity}
                  newOrder={newOrder}
                  formRef={formRef}
                  keys={keys}
                  discountPercentage={discountPercentage}
                  discounts={discounts}
                  fetchedProvinces={fetchedProvinces}
                  orderLoading={orderLoading}
                  orderID={keys.uuid}
                  shipmentData={shipmentData?.destination}
                  shipmentErrors={{
                    provinceError: errors?.provinceNotSelected,
                    userDataError: errors?.userData,
                  }}
                  getProvinces={getProvinces}
                  getStates={getStates}
                  productQuantityChange={productQuantityChange}
                />
              )}
              <button
                style={{
                  position: "absolute",
                  top: 1,
                  right: 1,
                  margin: "3px",
                  border: "none",
                  outline: "none",
                  marginRight: "25px",
                  marginBottom: "10px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  background: "transparent",
                  fontSize: "39px",
                  color: "#888888",
                }}
                onClick={modalHandler}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span
                    style={{
                      background: "#e2e2e2",
                      borderRadius: "4px",

                      padding: "0px",
                      margin: "0px",
                    }}
                  >
                    x
                  </span>
                  <span style={{ fontSize: "15px" }}>cerrar</span>
                </div>
              </button>
            </div>
          </div>
        </>
      )}

      <button className={styles.buyBtn} onClick={modalHandler}>
        <BsFillCartFill
          style={{ width: "20px", height: "20px", marginRight: "5px" }}
        />
        <span style={{ fontSize: "14px" }}>
          ¿Te gusto como quedo tu producto?, ¡Compralo!
        </span>
      </button>
    </div>
  );
}

export default BuyModalWindow;
