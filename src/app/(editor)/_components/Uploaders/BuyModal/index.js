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

  useEffect(() => {
    if (currentProduct) {
      try {
        const parsedProduct = JSON.parse(currentProduct);
        console.log("parsed: ", parsedProduct);
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
      const response = await fetch("/api/new-order/normal-order", {
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
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {orderLoading && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.9)", // White with 50% transparency
                  zIndex: 9999, // Adjust the z-index as needed
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    alignContent: "center",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CommonLoader />
                  <p style={{ fontSize: "20px", color: "#818181" }}>
                    Inicializando orden...
                  </p>
                </div>
              </div>
            )}
            <button
              style={
                deliveryWay === "cashOnDelivery"
                  ? { background: "#1483FF", color: "#fff" }
                  : {}
              }
              className={styles.switchBtn}
              onClick={() => handleDeliveryWay("cashOnDelivery")}
            >
              Pago contra entrega
            </button>
            {deliveryWay === "normalDelivery" && (
              <div className={styles.bodySection}>
                <div
                  style={{
                    border: "1px solid #e2e2e2",
                    marginBottom: "6px",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                >
                  <h1 style={{ fontWeight: "700" }}>
                    Compra de {product.name} personalizado
                  </h1>
                </div>
                <div
                  style={{
                    display: "flex",
                    border: "1px solid #e2e2e2",
                    padding: "5px",
                    borderRadius: "4px",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <div>
                      <div
                        style={{
                          border: "1px solid #e2e2e2",
                          marginTop: "4px",
                          marginBottom: "4px",
                          padding: "8px",
                          borderRadius: "4px",
                          background: "#e2e2e2",
                        }}
                      >
                        <p style={{ fontSize: "16px" }}>
                          <span style={{ fontWeight: "700" }}>1.</span>{" "}
                          proporciona la dirección a la que deseas que enviemos
                          tu(s) producto(s) personalizado(s) y, si tienes alguna
                          preferencia, indícanos con qué empresa de envíos te
                          sientes más cómodo.
                        </p>
                      </div>
                      <div>
                        <div>
                          <select
                            name="destination"
                            onChange={(e) =>
                              getStates(e.target.value, e.target.name)
                            }
                            style={{
                              width: "100%",
                              height: "30px",
                              border: "1px solid #e3e4e5",
                              outline: "none",
                              cursor: "pointer",
                              borderRadius: "3px",
                              marginTop: "3px",
                              width: "100%",
                              fontSize: "16px",
                            }}
                          >
                            <option value="">Selecciona tú departamento</option>
                            {colombiaStates.data.map((state) => (
                              <option
                                key={state.name}
                                value={JSON.stringify({
                                  code: state.code_2_digits,
                                  name: state.name,
                                })}
                              >
                                {state.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <select
                            name="destination"
                            onChange={(e) =>
                              getProvinces(e.target.value, e.target.name)
                            }
                            style={{
                              width: "100%",
                              height: "30px",
                              border: "1px solid #e3e4e5",
                              outline: "none",
                              cursor: "pointer",
                              borderRadius: "3px",
                              marginTop: "5px",
                              fontSize: "16px",
                            }}
                          >
                            <option value="">Selecciona tú provincia</option>
                            {fetchedProvinces.destinationProvinces?.data?.map(
                              (state, index) => (
                                <option
                                  key={index}
                                  value={JSON.stringify({
                                    stateCode: state.state_code,
                                    code: state.code,
                                    name: state.name,
                                  })}
                                >
                                  {state.name}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap", // Allow items to wrap to the next row
                        }}
                      >
                        {fetchedCouriers?.data
                          ?.filter((courier) => courier.name !== "saferbo")
                          .map((courier) => (
                            <div
                              key={courier.name}
                              style={{
                                flex: "0 0 calc(33.33% - 10px)", // Each item takes 33.33% width with some spacing
                                marginTop: "10px",
                                marginBottom: "10px", // Space between rows
                                marginRight: "10px", // Space between columns
                                border: "1px solid #e3e4e5",
                                borderRadius: "3px",
                                padding: "3px",
                              }}
                            >
                              <label>
                                <input
                                  type="radio"
                                  name="selector"
                                  value={courier.name}
                                  checked={
                                    courier.name ===
                                    shipmentData.shipmentProvider
                                  }
                                  style={{
                                    marginRight: "5px",
                                    cursor: "pointer",
                                  }}
                                  onChange={() =>
                                    handleCourierSelected(courier.name)
                                  }
                                />
                                {courier.name}
                                {courier.name === "interRapidisimo" && (
                                  <span> (Recomendado)</span>
                                )}
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="direccion" style={{ fontSize: "13px" }}>
                        Dirección de Envío:
                      </label>
                      <input
                        type="text"
                        id="direccion"
                        placeholder="Proporcionanos tu dirección"
                        style={{
                          width: "100%",
                          fontSize: "15px",
                          padding: "4px",
                          outline: "none",
                          border: "1px solid rgb(20, 131, 255)",
                          borderRadius: "4px",
                        }}
                      ></input>
                    </div>

                    <button
                      style={{
                        width: "100%",
                        marginTop: "5px",
                        border: "none",
                        outline: "none",
                        padding: "5px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        background: "#1483FF",
                        color: "#fff",
                      }}
                      onClick={shippingPrice}
                    >
                      Calcular envio
                    </button>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column", // Centered content in a column layout
                      textAlign: "center", // Center text
                    }}
                  >
                    <div
                      style={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "white",
                        zIndex: 1, // Ensure the header is above other content
                        width: "100%",
                        padding: "10px 0",
                        marginBottom: "20px", // Add margin below the header
                      }}
                    >
                      {deliveryData.length > 0 && (
                        <h2>
                          Servicios de {deliveryData[0]?.carrier} disponibles
                          actualmente
                        </h2>
                      )}
                    </div>
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        width: "100%",
                        overflow: "auto", // Create a scrollable container
                        maxHeight: "300px", // Set a maximum height for the scrollable content
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {deliveryData.length > 0 ? (
                        <>
                          {loading.loadingDeliveryData ? (
                            <>Obteniendo datos de envío...</>
                          ) : (
                            <>
                              {deliveryData.map((delivery) => (
                                <div
                                  key={delivery.serviceId}
                                  style={{
                                    border: "1px solid #ccc",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    marginTop: "10px",
                                    borderRadius: "5px",
                                    width: "90%",
                                  }}
                                >
                                  <label
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      height: "100%",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignContent: "center",
                                        width: "80px",
                                        height: "100%",
                                        background: "#d7d7d7",
                                        justifyContent: "center",
                                        borderRadius: "4px 0px 0px 4px",
                                      }}
                                    >
                                      <input
                                        type="radio"
                                        name="deliverySelection"
                                        value={delivery ? delivery : undefined}
                                        checked={
                                          selectedDelivery.serviceId ===
                                          delivery.serviceId
                                        }
                                        onChange={() =>
                                          handleDeliveryChange(delivery)
                                        }
                                        style={{ marginRight: "10px" }}
                                      />
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "12px",
                                        width: "100%",
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontWeight: "bold",
                                          width: "100%",
                                        }}
                                      >
                                        {delivery.carrier}
                                      </p>
                                      <p>
                                        Fecha de entrega estimada:{" "}
                                        {delivery.deliveryDate.date}
                                      </p>
                                      <p>
                                        Precio base del envío:{" "}
                                        {delivery.basePrice}
                                      </p>
                                    </div>
                                  </label>
                                </div>
                              ))}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {loading.loadingDeliveryData ? (
                            <>Obteniendo datos de envío...</>
                          ) : (
                            <>
                              {Object.values(errors).some(
                                (error) => error !== ""
                              ) ? (
                                <div
                                  style={{
                                    maxWidth: "450px",
                                    border: "1px solid #b50202",
                                    padding: "8px",
                                    borderRadius: "4px",
                                    color: "#fff",
                                    background: "#b50202",
                                  }}
                                >
                                  {Object.entries(errors).map(
                                    ([key, value]) => (
                                      <p key={key}>{value}</p>
                                    )
                                  )}
                                </div>
                              ) : (
                                <img
                                  style={{
                                    marginTop: "20px", // Add some space between the image and text
                                    overflow: "hidden",
                                  }}
                                  draggable={false}
                                  src="/icons/delivery-icon.png"
                                  alt="Delivery Icon"
                                ></img>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    border: "1px solid #e2e2e2",
                    padding: "4px",
                    borderRadius: "4px",
                    marginTop: "5px",
                  }}
                >
                  <div
                    style={{
                      border: "1px solid #e2e2e2",
                      padding: "4px",
                      borderRadius: "4px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          border: "1px solid #e2e2e2",
                          marginTop: "4px",
                          marginBottom: "4px",
                          padding: "8px",
                          borderRadius: "4px",
                          background: "#e2e2e2",
                        }}
                      >
                        <p style={{ fontSize: "16px" }}>
                          <span style={{ fontWeight: "700" }}>2.</span> Elige la
                          cantidad de productos y danos tu correo electronico
                          para continuar con la transacción.
                        </p>
                      </div>
                      <div className={styles.properties}>
                        <span
                          style={{
                            background: "#e2e2e2",
                            padding: "4px",
                            color: "#333",
                            width: "200px",
                          }}
                        >
                          Precio de producción
                        </span>
                        <span
                          style={{
                            margin: "0px 2px 0px 4px",
                            color: "#000",
                            fontWeight: 700,
                          }}
                        >
                          {product?.productData?.prices?.basePrice}
                        </span>
                        COP
                      </div>

                      <div className={styles.properties}>
                        <span
                          style={{
                            background: "#e2e2e2",
                            padding: "4px",
                            color: "#333",
                            width: "200px",
                          }}
                        >
                          Cantidad
                        </span>
                        <input
                          style={{
                            border: "1px solid #1483FF",
                            outline: "#1483FF",
                            borderRadius: "4px",
                            fontSize: "15px",
                            padding: "2px",
                            marginLeft: "4px",
                          }}
                          type="number"
                          name="extra1"
                          onChange={(e) => productQuantityChange(e)}
                          className={styles.productQuantityField}
                          value={productQuantity}
                        ></input>
                      </div>
                    </div>
                    <div className={styles.properties}>
                      <span
                        style={{
                          background: "#e2e2e2",
                          padding: "4px",
                          color: "#333",
                          width: "200px",
                        }}
                      >
                        Precio total de producto(s)
                      </span>
                      <span
                        style={{
                          marginLeft: "4px",
                        }}
                      >
                        {productTotal
                          ? productTotal
                          : product?.productData?.basePrice}
                      </span>
                    </div>

                    <div className={styles.properties}>
                      <span
                        style={{
                          background: "#e2e2e2",
                          padding: "4px",
                          color: "#333",
                          width: "200px",
                        }}
                      >
                        Precio total del envio
                      </span>
                      <span
                        style={{
                          marginLeft: "4px",
                        }}
                      >
                        {selectedDelivery.basePrice ? (
                          selectedDelivery.basePrice
                        ) : (
                          <>Por calcular</>
                        )}
                      </span>
                    </div>

                    <div className={styles.properties}>
                      <span
                        style={{
                          background: "#e2e2e2",
                          padding: "4px",
                          color: "#333",
                          width: "200px",
                        }}
                      >
                        Precio total
                      </span>
                      <span
                        style={{
                          marginLeft: "4px",
                        }}
                      >
                        <>
                          {productTotal + selectedDelivery?.basePrice ||
                            productTotal}
                        </>
                      </span>
                    </div>

                    {discountPercentage > 0 && (
                      <div
                        style={{
                          width: "100%",
                          background: "#4cfc55",
                          border: "1px solid #0e8a14",
                          padding: "3px",
                          borderRadius: "4px",
                          marginBottom: "3px",
                          color: "#025706",
                        }}
                      >
                        Descuento del {discountPercentage}% aplicado
                      </div>
                    )}
                    <div>
                      {discounts.length > 0 &&
                        discounts?.map((discount) => (
                          <p key={discount.percentage}>
                            Al comprar más de {discount.amount} productos tienes
                            un descuento de {discount.percentage}%
                          </p>
                        ))}
                    </div>
                  </div>
                  <form
                    onSubmit={newOrder}
                    ref={formRef}
                    method="post"
                    action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu"
                  >
                    <input name="merchantId" type="hidden" value="508029" />
                    <input name="accountId" type="hidden" value="512321" />
                    <input name="taxReturnBase" value="0" type="hidden"></input>
                    <input name="tax" value="0" type="hidden"></input>
                    <input
                      name="description"
                      type="hidden"
                      value={keys.uuid || ""}
                    />
                    <input
                      name="referenceCode"
                      type="hidden"
                      value={keys.uuid || ""}
                    />
                    <input
                      name="amount"
                      type="hidden"
                      value={productTotal + selectedDelivery.basePrice || ""}
                    />
                    <input name="currency" type="hidden" value="COP" />
                    <input
                      name="signature"
                      type="hidden"
                      value={keys.signature || ""}
                    />
                    <input name="test" type="hidden" value="1" />
                    <input
                      name="responseUrl"
                      type="hidden"
                      value="http://localhost:3000/print-on-demand/payment/response"
                    />
                    <input
                      name="confirmationUrl"
                      type="hidden"
                      value=" https://two-owls-argue.loca.lt/api/external/print-on-demand/confirmation"
                    />

                    <div
                      style={{
                        border: "1px solid #e2e2e2",
                        padding: "4px",
                        marginTop: "4px",
                        borderRadius: "4px",
                      }}
                    >
                      <input
                        style={{
                          border: "1px solid #333",
                          marginTop: "4px",
                          marginBottom: "4px",
                          width: "100%",
                          padding: "3px",
                          borderRadius: "4px",
                          outline: "none",
                        }}
                        name="buyerEmail"
                        placeholder="Tu email"
                        //value={loggedInUser?.user?.email || ""}
                      />

                      <input
                        name="Submit"
                        type="submit"
                        value="Comprar"
                        disabled={!Object.keys(deliveryData).length}
                        style={{
                          border: "none",
                          outline: "none",
                          height: "30px",
                          width: "100%",
                          background: !Object.keys(deliveryData).length
                            ? "#5dc26e"
                            : "#33b249",
                          borderRadius: "4px",
                          color: "#fff",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </form>
                </div>
              </div>
            )}

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
      )}

      <button className={styles.buyBtn} onClick={modalHandler}>
        <BsFillCartFill
          style={{ width: "20px", height: "20px", marginRight: "5px" }}
        />
        <span style={{ fontSize: "14px" }}>
          ¿Te gusto como quedo tu producto?, ¡Compralo!
        </span>
      </button>

      {!isPreviewing && (
        <button className={styles.buyResponsiveBtn} onClick={modalHandler}>
          Comprar
        </button>
      )}
    </div>
  );
}

export default BuyModalWindow;
