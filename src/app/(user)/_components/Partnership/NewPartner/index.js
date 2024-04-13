"use client";
import { useState } from "react";
import GenerateAffiliateLink from "../GenerateAffiliateLink";
import { IoIosWarning } from "react-icons/io";
import { getUser, updateUser } from "@/app/_lib/userProfiles";
import { FaPhoneAlt } from "react-icons/fa";
import ShortUniqueId from "short-unique-id";
import { RiMessage2Fill } from "react-icons/ri";
import { GrStatusGood } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";

export default function NewPartner({ user }) {
  const [nequiPhone, setNequiPhone] = useState("");
  const [errors, setErrors] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationCodeField, setVerificationCodeField] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const handleNequiPhoneChange = (e) => {
    setNequiPhone(e.target.value);
  };

  const phoneNumberVerifier = () => {
    if (generatedCode.length === 0) {
      const phoneCode = new ShortUniqueId({
        dictionary: "number",
        length: 6,
      });

      const generatedPhoneCode = phoneCode.rnd();
      console.log(generatedPhoneCode);
      setGeneratedCode(generatedPhoneCode);
      setVerificationCodeField(true);
      /*
      const response = await fetch("/api/nequi-phone-verificator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generatedPhoneCode, nequiPhone }),
      });
       */
    }
  };

  const affiliateHandler = async () => {
    const userData = await getUser(user.email);
    const { document } = userData;
    const { email } = document;
    console.log(email, document);
    if (!document.affiliateData?.affiliateId) {
      setErrors("Por favor, genera tu enlace de afiliado.");
      return;
    }

    if (nequiPhone.length === 0) {
      setErrors(
        "Debes proporcionar un número de teléfono que esté vinculado a Nequi para que podamos realizar tus pagos."
      );
      return;
    }

    if (!isPhoneVerified) {
      setErrors("Debes verificar tu número de telefono para proseguir.");
      return;
    }

    setErrors("");
    await updateUser(email, {
      "affiliateData.isAffiliated": true,
      "affiliateData.wallet": 0,
      "affiliateData.sales": 0,
      "affiliateData.soldProducts": {},
    });
    window.location.reload();
  };

  const handleChangeNequiVerificationNumber = (e) => {
    const inputCode = e.target.value;
    if (inputCode === generatedCode) {
      setIsPhoneVerified(true);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          width: "100%",
          overflow: "auto",
          margin: "20px",
          height: "85%",
          borderRadius: "6px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "60px",
            borderRadius: "4px",
            padding: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottom: "1px solid #dedede",
          }}
        >
          <p>Bienvenido al panel de socios {user.name}</p>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#1A83FF",
              padding: "5px",
              borderRadius: "6px 6px 0px 0px",
              color: "#fff",
            }}
          >
            <p>
              ¡Estas a 3 sencillos pasos de ser socio de Impretion y ganar
              dinero!
            </p>
          </div>

          <div
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #1A83FF",
              borderRadius: "4px",
              background: "#CFE5FF",
              color: "#555555",
            }}
          >
            <p>1. Genera tu enlace de afiliado.</p>
            <p>
              2. Indica cómo deseas que te paguemos. Por el momento, solo
              transferimos a Nequi y cuentas Bancolombia.
            </p>
            <p>3. En caso de que utilices Nequi, verifica tu número.</p>
          </div>

          <div
            style={{
              border: "1px solid #dedede",
              margin: "10px",
              width: "100%",
            }}
          >
            <GenerateAffiliateLink />
          </div>

          <div
            style={{
              border: "1px solid #dedede",
              margin: "10px",
              width: "100%",
            }}
          >
            <p style={{ margin: "10px" }}>¿Por dónde te enviamos tu dinero?</p>

            <div
              style={{
                padding: "10px",
                border: "1px solid #FFD51E",
                borderRadius: "4px",
                background: "#FFF2BA",
                color: "#555555",
                margin: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IoIosWarning style={{ color: "#FFD51E", fontSize: "22px" }} />

              <p>
                Enviaremos el dinero a la cuenta de Nequi asociada con el número
                de teléfono que proporciones, así que asegúrate de tener Nequi
                en ese número.
              </p>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "50%", margin: "10px" }}>
                <p>
                  Enviaremos tu dinero por medio de nequi, pon tu numero de
                  telefono, enviaremos un mensaje para verificar que si eres tú.
                </p>
                <div style={{ display: "flex", marginTop: "15px" }}>
                  <img
                    src="/icons/nequi.webp"
                    style={{
                      width: "40px",
                      border: "1px solid #dedede",
                      padding: "8px",
                      borderRadius: "0px 0px 0px 20px",
                    }}
                  ></img>
                  <input
                    type="number"
                    placeholder="Tu número de teléfono de Nequi."
                    style={{
                      outline: "none",
                      border: "1px solid #dedede",
                      width: "100%",
                      color: "#555555",
                      fontSize: "19px",
                      padding: "8px",
                      borderRadius: "0px 0px 6px 0px",
                    }}
                    onChange={handleNequiPhoneChange}
                  ></input>
                </div>
              </div>
              {/*
              <div style={{ border: "1px solid #dedede", margin: "5px" }}></div>
              <div style={{ width: "50%", margin: "10px" }}>
                <p>
                  En caso de que nequi no funcione, agrega tu numero de
                  bancolombia activo al cual podamos enviar transferencias.
                </p>
                <div style={{ display: "flex", marginTop: "15px" }}>
                  <img
                    src="/icons/bancolombia.webp"
                    style={{
                      width: "40px",
                      border: "1px solid #dedede",
                      padding: "8px",
                      borderRadius: "0px 0px 0px 20px",
                    }}
                  ></img>
                  <input
                    type="number"
                    placeholder="Tu número de Bancolombia."
                    style={{
                      outline: "none",
                      border: "1px solid #dedede",
                      width: "100%",
                      color: "#555555",
                      fontSize: "19px",
                      padding: "8px",
                      borderRadius: "0px 0px 6px 0px",
                    }}
                  ></input>
                </div>
              </div>
               */}
            </div>
          </div>

          {nequiPhone.length > 0 && (
            <div
              style={{
                border: "1px solid #dedede",
                margin: "10px",
                width: "100%",
                padding: "20px",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex" }}>
                  <button
                    style={{
                      border: "none",
                      outline: "none",
                      background: "#1A83FF",
                      padding: "10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: "#fff",
                    }}
                    onClick={phoneNumberVerifier}
                    disabled={generatedCode.length > 0 && true}
                  >
                    VERIFICAR
                  </button>
                  <div style={{ margin: "10px" }}>
                    <FaPhoneAlt />
                    <span style={{ marginLeft: "5px" }}>{nequiPhone}</span>
                  </div>
                </div>

                <div
                  style={{ border: "1px solid #dedede", margin: "10px" }}
                ></div>
                {verificationCodeField && (
                  <div style={{ marginTop: "5px" }}>
                    <div
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #1A83FF",
                        borderRadius: "4px",
                        background: "#CFE5FF",
                        color: "#555555",
                        display: "flex",
                      }}
                    >
                      <RiMessage2Fill style={{ marginRight: "5px" }} />
                      <p>Un codigo ha sido enviado a tu numero de telefono</p>
                    </div>
                    <input
                      type="number"
                      placeholder="Tú codigo de verificación"
                      maxLength={6}
                      style={{
                        marginTop: "10px",
                        outline: "none",
                        border: isPhoneVerified
                          ? "1px solid #dedede"
                          : "1px solid #1A83FF",
                        fontSize: "17px",
                        borderRadius: "4px",
                        padding: "5px",
                        background: isPhoneVerified && "#DFDFDF",
                      }}
                      disabled={isPhoneVerified && true}
                      onChange={handleChangeNequiVerificationNumber}
                    ></input>
                  </div>
                )}

                {isPhoneVerified && (
                  <div
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #24D100",
                      borderRadius: "4px",
                      background: "#D4FFCB",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <GrStatusGood
                      style={{ height: "100%", color: "#24D100" }}
                    />
                    Te haz verificado con exito
                  </div>
                )}
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  transform: "translateY(-14px)",
                  background: "#FFD51E",
                  padding: "3px",
                  borderRadius: "4px",
                }}
              >
                Verifica tu numero de telefono
              </div>
            </div>
          )}

          <button
            style={{
              width: "100%",
              minHeight: "30px",
              outline: "none",
              border: "none",
              borderRadius: "4px",
              background: "#1A83FF",
              cursor: "pointer",
              color: "#fff",
              fontWeight: "700",
              fontSize: "19px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={affiliateHandler}
          >
            <span>VOLVERME AFILIADO</span>
            <IoIosSend style={{ marginLeft: "10px" }} />
          </button>

          {errors.length > 0 && (
            <div
              style={{
                background: "#FF4848",
                marginTop: "10px",
                padding: "5px",
                width: "100%",
                color: "#fff",
                borderRadius: "4px",
                display: "flex",
              }}
            >
              <IoIosWarning style={{ color: "#fff" }} />
              <p style={{ marginRight: "10px" }}>{errors}</p>
            </div>
          )}

          {/*
          <p>
            Cada ves que algun usuario compre algo con tu link tu billetera se
            actualizara
          </p>
          <span>Billetera</span>
          <p>Dinero total: $0</p>

          <hr style={{ width: "100%", height: "1px" }} />
          <p>
            *La comision que ganas por la venta de cada producto es del 50%*
          </p>
          <p>
            Puedes retirar el dinero hasta 3 veces por mes, actualmente
            utilizamos nequi y bancolombia para transferir tu dinero, la
            transferencia es completamente automatica, sin embargo, si hay
            fallos en los sitemas de nequi/bancolombia, el envio se hara manual.
          </p>
            
            <p>
              Para que sea mas facil para ti te proporcionamos algunas
              platillas, las puedes publicar en tus estados de whatsapp,
              instagram, facebook o la red social que prefieras!
            </p>
            <div
              style={{
                height: "70%",
                background: "lightgreen",
                width: "100%",
                padding: "10px",
                overflowY: "auto",
              }}
            >
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
            </div>
            */}
        </div>
      </div>
    </>
  );
}
