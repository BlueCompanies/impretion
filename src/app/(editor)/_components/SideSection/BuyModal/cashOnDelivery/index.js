import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import colombiaStates from "@/app/_lib/colombiaStates";
import BasicLoader from "@/app/_components/Loaders/Loader";
import DiscountCode from "../_components/DiscountCode";
export default function CashOnDelivery(props) {
  const {
    productName,
    productBasePrice,
    productQuantity,
    productTotal,
    newOrder,
    formRef,
    keys,
    discountPercentage,
    discounts,
    shipmentErrors,
    fetchedProvinces,
    getProvinces,
    getStates,
    productQuantityChange,
    orderID,
    shipmentData,
    orderLoading,
    userData,
  } = props;
  const [userDeliveryData, setUserDeliveryData] = useState({
    address: "",
    telephone: "",
    additional: "",
    name: "",
    email: "",
  });

  const getUserAddress = (e) => {
    setUserDeliveryData({
      ...userDeliveryData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {orderLoading && (
        <div>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
          ></div>
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              fontSize: "24px",
              zIndex: 1000,
            }}
          >
            <BasicLoader />
          </div>
        </div>
      )}
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
            Compra de {productName} personalizado
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
                  <span style={{ fontWeight: "700" }}>1.</span> Por favor,
                  proporciona la dirección y tus datos de envío para que podamos
                  enviar tu(s) producto(s) personalizado(s) correctamente.
                </p>
              </div>
              <div>
                <div>
                  <div
                    style={{
                      width: "100%",
                      background: "#f7c3be",
                      marginTop: "6px",
                      marginBottom: "6px",
                      border: "1px solid #ff7e73",
                      padding: "6px",
                      borderRadius: "6px",
                      color: "#8a0e03",
                      display:
                        shipmentErrors?.provinceError ||
                        shipmentErrors?.userDataError?.address ||
                        shipmentErrors?.userDataError?.name ||
                        shipmentErrors?.userDataError?.telephone ||
                        shipmentErrors?.userDataError?.email
                          ? "block"
                          : "none",
                    }}
                  >
                    {shipmentErrors?.provinceError && (
                      <p>{shipmentErrors?.provinceError}</p>
                    )}

                    {shipmentErrors?.userDataError?.address && (
                      <p>{shipmentErrors?.userDataError?.address}</p>
                    )}

                    {shipmentErrors?.userDataError?.name && (
                      <p>{shipmentErrors?.userDataError?.name}</p>
                    )}

                    {shipmentErrors?.userDataError?.telephone && (
                      <p>{shipmentErrors?.userDataError?.telephone}</p>
                    )}

                    {shipmentErrors?.userDataError?.email && (
                      <p>{shipmentErrors?.userDataError?.email}</p>
                    )}
                  </div>

                  <select
                    name="destination"
                    onChange={(e) => getStates(e.target.value, e.target.name)}
                    style={{
                      width: "100%",
                      height: "30px",
                      border: `${
                        shipmentErrors?.provinceError
                          ? "1px solid red"
                          : "1px solid #e3e4e5"
                      }`,
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
                      border: `${
                        shipmentErrors?.provinceError
                          ? "1px solid red"
                          : "1px solid #e3e4e5"
                      }`,
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
            </div>
            <div>
              <div>
                <label
                  htmlFor="direccion"
                  style={{
                    fontSize: "13px",
                    color: shipmentErrors?.userDataError?.address
                      ? "red"
                      : "#333",
                  }}
                >
                  Dirección de envío: (*obligatorio)
                </label>
                <input
                  type="text"
                  placeholder="Proporcionanos tu dirección"
                  name="address"
                  id="direccion"
                  maxLength={100}
                  onChange={getUserAddress}
                  style={{
                    width: "100%",
                    fontSize: "15px",
                    padding: "4px",
                    outline: "none",
                    border: shipmentErrors?.userDataError?.address
                      ? "1px solid red"
                      : "1px solid rgb(20, 131, 255)",
                    borderRadius: "4px",
                  }}
                ></input>
              </div>

              <div style={{ marginTop: "5px" }}>
                <label htmlFor="direccion" style={{ fontSize: "13px" }}>
                  Datos de envío adicionales:
                </label>
                <input
                  type="text"
                  placeholder="Datos adicionales de tu dirección"
                  name="additional"
                  id="direccion"
                  maxLength={100}
                  onChange={getUserAddress}
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

              <div style={{ marginTop: "5px" }}>
                <label
                  htmlFor="direccion"
                  style={{
                    fontSize: "13px",
                    color: shipmentErrors?.userDataError?.name ? "red" : "#333",
                  }}
                >
                  Nombre del que recibe: (*obligatorio)
                </label>
                <input
                  type="text"
                  placeholder="Nombre de la persona responsable de recibir el producto"
                  name="name"
                  id="direccion"
                  maxLength={64}
                  onChange={getUserAddress}
                  style={{
                    width: "100%",
                    fontSize: "15px",
                    padding: "4px",
                    outline: "none",
                    border: shipmentErrors?.userDataError?.name
                      ? "1px solid red"
                      : "1px solid rgb(20, 131, 255)",
                    borderRadius: "4px",
                  }}
                ></input>
              </div>

              <div style={{ marginTop: "5px" }}>
                <label
                  htmlFor="direccion"
                  style={{
                    fontSize: "13px",
                    color: shipmentErrors?.userDataError?.telephone
                      ? "red"
                      : "#333",
                  }}
                >
                  Teléfono: (*obligatorio)
                </label>
                <input
                  type="number"
                  id="direccion"
                  placeholder="Teléfono de contacto"
                  name="telephone"
                  onChange={getUserAddress}
                  onInput={(e) =>
                    (e.target.value = e.target.value.slice(0, 19))
                  }
                  style={{
                    width: "100%",
                    fontSize: "15px",
                    padding: "4px",
                    outline: "none",
                    border: shipmentErrors?.userDataError?.telephone
                      ? "1px solid red"
                      : "1px solid rgb(20, 131, 255)",
                    borderRadius: "4px",
                  }}
                ></input>
              </div>

              <div style={{ marginTop: "5px" }}>
                <label
                  htmlFor="direccion"
                  style={{
                    fontSize: "13px",
                    color: shipmentErrors?.userDataError?.email
                      ? "red"
                      : "#333",
                  }}
                >
                  Correo electrónico: (*obligatorio)
                </label>
                <input
                  type="email"
                  placeholder="Correo electronico de contacto"
                  name="email"
                  id="direccion"
                  maxLength={45}
                  onChange={getUserAddress}
                  style={{
                    width: "100%",
                    fontSize: "15px",
                    padding: "4px",
                    outline: "none",
                    border: "1px solid rgb(20, 131, 255)",
                    borderRadius: "4px",
                    border: shipmentErrors?.userDataError?.email
                      ? "1px solid red"
                      : "1px solid rgb(20, 131, 255)",
                  }}
                ></input>
              </div>
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
                  cantidad.
                </p>
              </div>
              <div
                style={{
                  width: "100%",
                  background: "#f7c3be",
                  marginTop: "6px",
                  marginBottom: "6px",
                  border: "1px solid #ff7e73",
                  padding: "6px",
                  borderRadius: "6px",
                  color: "#8a0e03",
                  display: productTotal > 0 && "none",
                }}
              >
                {productTotal <= 0 && (
                  <span>Debes comprar minimo un producto.</span>
                )}
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
                  Precio de producción{" "}
                </span>
                <span
                  style={{
                    margin: "0px 2px 0px 4px",
                    color: "#000",
                    fontWeight: 700,
                  }}
                >
                  {productBasePrice}{" "}
                </span>
                COP
                {userData?.affiliateData.affiliateId.enabled && (
                  <> (sin descuentos)</>
                )}
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
                  onInput={(e) => (e.target.value = e.target.value.slice(0, 3))}
                  onChange={(e) => productQuantityChange(e)}
                  className={styles.productQuantityField}
                  value={productQuantity}
                ></input>
              </div>
            </div>

            <DiscountCode />
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

              <div
                style={{
                  marginLeft: "4px",
                }}
              >
                {userData?.affiliateData.affiliateId.enabled ? (
                  <>{productTotal - productTotal * 0.1}</>
                ) : (
                  <>{productTotal}</>
                )}
              </div>
            </div>

            <div style={{ border: "1px solid #dedede", margin: "10px" }}></div>

            {userData?.affiliateData.affiliateId.enabled && (
              <div
                style={{
                  width: "100%",
                  background: "#00B8D1",
                  border: "1px solid #006876",
                  padding: "3px",
                  borderRadius: "4px",
                  marginBottom: "3px",
                  color: "#fff",
                }}
              >
                Has obtenido un descuento del 10% mediante un código
                promocional. Este se aplicará al precio total al procesar tu
                compra.
              </div>
            )}
            {discountPercentage > 0 && (
              <>
                <div
                  style={{ border: "1px solid #dedede", margin: "10px" }}
                ></div>
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
                  Descuento del {discountPercentage}% aplicado por compra
                  mayoritaria.
                </div>
              </>
            )}
            <div style={{ border: "1px solid #dedede", margin: "10px" }}></div>
            <div>
              {discounts?.length > 0 &&
                discounts?.map((discount) => (
                  <p key={discount.percentage}>
                    Al comprar más de {discount.amount} productos tienes un
                    descuento de {discount.percentage}%
                  </p>
                ))}
            </div>
          </div>
          <form
            onSubmit={(e) => newOrder(e, userDeliveryData)}
            ref={formRef}
            method="post"
            action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/"
          >
            {/* Checks if there is any discount by promo code */}
            <input name="merchantId" type="hidden" value="508029" />
            <input name="accountId" type="hidden" value="512321" />
            <input name="taxReturnBase" value="0" type="hidden"></input>
            <input name="tax" value="0" type="hidden"></input>
            <input
              name="description"
              type="hidden"
              value={
                `${productQuantity}x ${productName} | ${
                  userData?.affiliateData.affiliateId.enabled &&
                  "Descuento del 10% sobre el precio total"
                }` || ""
              }
            />
            {/*keys.uuid || ""*/}
            <input
              name="referenceCode"
              type="hidden"
              value={"uiuziuixxwqqqzttzxxyy"}
            />
            {/* the full amount should be checked if affiliated id is enabled if so, add the 10% discount to the total amount */}
            <input
              name="amount"
              type="hidden"
              value={
                userData?.affiliateData.affiliateId.enabled
                  ? 14000 - 14000 * 0.1 || ""
                  : 14000 || ""
              }
            />
            <input name="currency" type="hidden" value="COP" />
            <input name="shippingCountry" type="hidden" value="CO"></input>
            <input name="Ing" type="hidden" value="es"></input>
            <input
              name="buyerEmail"
              type="hidden"
              value={userDeliveryData.email}
            ></input>
            <input
              name="mobilePhone"
              type="hidden"
              value={userDeliveryData.telephone}
            ></input>
            <input
              name="buyerFullName"
              type="hidden"
              value={userDeliveryData.name}
            ></input>
            <input
              name="shippingAddress"
              type="hidden"
              value={userDeliveryData.address}
            ></input>
            <input
              name="shippingCity"
              type="hidden"
              value={shipmentData.provinceLocation.province || ""}
            ></input>

            {/* keys.signature */}
            <input
              name="signature"
              type="hidden"
              value={"bdece5e692bc5f1e0619dfc108b0b686"}
            />
            <input name="test" type="hidden" value="1" />
            <input name="extra1" type="hidden" value={orderID || ""}></input>
            <input
              name="extra2"
              type="hidden"
              value={`${
                userData?.affiliateData?.affiliateId?.enabled
                  ? userData?.affiliateData.affiliateId.id
                  : null
              }`}
            ></input>
            <input
              name="extra3"
              type="hidden"
              value={`${userDeliveryData.address} - ${userDeliveryData.additional}`}
            ></input>
            <input
              name="responseUrl"
              type="hidden"
              value="http//:localhost:3000/orders/normal-order-response"
            />
            <input
              name="confirmationUrl"
              type="hidden"
              value="https://0976-2800-e2-1300-3ea-3139-ef10-5049-1889.ngrok-free.app/api/orders/normal-order/confirmation"
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
                name="Submit"
                type="submit"
                value={`Comprar`}
                disabled={productTotal <= 0 ? true : false}
                style={{
                  border: "none",
                  outline: "none",
                  height: "30px",
                  width: "100%",
                  background: `${productTotal <= 0 ? "gray" : "#33b249"}`,
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
    </>
  );
}
