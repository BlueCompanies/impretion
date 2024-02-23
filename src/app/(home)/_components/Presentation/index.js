"use client";

import Image from "next/image";
import Reveal from "../../../_components/Utils/Reveal";
import styles from "./styles.module.css";
import { VscDebugStart } from "react-icons/vsc";
import { useRef } from "react";

export default function Presentation() {
  const productsCatalog = useRef(null);

  const handleScrollButton = () => {
    productsCatalog.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className={styles.firstSection}>
        <div
          style={{
            display: "flex",
            width: "100%",
            marginTop: "0px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column", // Ensure children are stacked vertically
              margin: "10px",
            }}
          >
            <div style={{ display: "flex" }}>
              <h1
                style={{
                  fontSize: "42px",
                  marginBottom: "20px",
                  fontWeight: 700,
                }}
                className={styles.text}
              >
                Diseña y vende productos personalizados
              </h1>
            </div>
            <h2 style={{ fontSize: "19px" }}>
              Deja volar tu imaginación y crea tu nuevo negocio facilmente
            </h2>
            <p
              style={{ marginTop: "14px", fontSize: "16px", color: "#555555" }}
            >
              Con Impretion es fácil emprender, no necesitas ser un experto en
              diseño
            </p>
            <ul
              style={{
                fontSize: "16px",
                color: "#555555",
                marginLeft: "30px",
                marginTop: "15px",
              }}
            >
              <li>Ofrecemos una gran variedad de diseños gratis</li>
              <li>Calidad de productos garantizada</li>
              <li>Escoje entre una gran variedad de productos</li>
            </ul>
            <button
              style={{
                margin: "auto 0px 5px 0px",
                width: "50%",
                padding: "15px",
                border: "none",
                outline: "none",
                borderRadius: "4px",
                backgroundColor: "#dedede",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => handleScrollButton()}
            >
              <span>Comenzar</span>
              <VscDebugStart
                style={{
                  fontSize: "20px",
                  marginLeft: "5px",
                }}
              />
            </button>
          </div>
          <div>
            <Image
              src="home/presentation.svg"
              style={{ margin: "10px", objectFit: "cover" }}
              width={650}
              height={650}
            ></Image>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "25px",
        }}
      >
        <section className={styles.secondSection}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className={styles.target}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="home/icons/easy-to-use.svg"></img>
                <p className={styles.subtitle}>Fácil de usar</p>
              </div>
              <p>
                Gracias a nuestro intuitivo editor, editar tus productos es
                bastante sencillo. No tienes que preocuparte por gastar dinero
                en costosos editores o diseñadores gráficos para crear tu propia
                marca.
              </p>
            </div>
            <div className={styles.target}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="home/icons/totally-free.svg"></img>
                <p className={styles.subtitle}>Totalmente gratis</p>
              </div>
              <p>
                Con Impretion, solo debes pagar por los artículos que compres.
                No pagas tarifas adicionales por el uso del editor, todo es
                completamente gratis.
              </p>
            </div>
            <div className={styles.target}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="home/icons/no-risks.svg"></img>
                <p className={styles.subtitle}>Sin riesgos</p>
              </div>
              <p>
                Estamos comprometidos con nuestros clientes para que sus
                productos les lleguen perfectos y que las órdenes se completen
                de forma correcta. De esta manera, garantizamos que nuestros
                clientes siempre estén felices con nuestro servicio.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className={styles.target}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="home/icons/superior-quality.svg"></img>
                <p className={styles.subtitle}>Calidad superior</p>
              </div>
              <p>
                Siempre buscamos que nuestros productos sean de la mejor
                calidad. De esta forma, podemos asegurar que el usuario final
                esté satisfecho con los artículos que compra.
              </p>
            </div>
            <div className={styles.target}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="home/icons/designs.svg"></img>
                <p className={styles.subtitle}>Miles de diseños</p>
              </div>
              <p>
                No tienes que preocuparte más por buscar diseños. Te ofrecemos
                miles de diseños y pre-diseños que puedes editar para agregarles
                tu toque de originalidad a cada uno, y lo mejor, son totalmente
                gratis.
              </p>
            </div>
            <div className={styles.target}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src="home/icons/customer-service.svg"></img>
                <p className={styles.subtitle}>Atención al cliente 24/7</p>
              </div>
              <p>
                ¿Tienes algún problema con algún producto? Contáctanos y
                estaremos pendientes para encontrar una solución inmediata. La
                satisfacción de nuestros clientes es lo más importante para
                nosotros.
              </p>
            </div>
          </div>
        </section>
      </div>
      <section
        ref={productsCatalog}
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#feecaf",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h4
            style={{
              fontSize: "40px",
              margin: "10px",
              width: "100%",
              fontWeight: 700,
            }}
          >
            Estás a unos pasos de comenzar tu negocio
          </h4>
          <p style={{ fontSize: "25px" }}>
            ¡Es tan fácil como dar unos cuantos clics!
          </p>
        </div>
        <div
          style={{
            height: "500px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Reveal
            styles={{ height: "500px", display: "flex", alignItems: "center" }}
          >
            <div className={styles.card}>
              <p className={styles.step}>Paso 1</p>
              <h3 className={styles.subtitle}>Elige un producto</h3>
              <p className={styles.bodyTextCard}>
                Contamos con una amplia variedad de productos de todo tipo,
                todos personalizables. Elige dependiendo del tipo de negocio que
                quieras tener.
              </p>
              <div className={styles.cardImageContainer}>
                <img
                  src="home/icons/product-select.svg"
                  style={{ width: "150px" }}
                  className={styles.cardImage}
                />
              </div>
            </div>
          </Reveal>

          <Reveal
            styles={{ height: "500px", display: "flex", alignItems: "center" }}
          >
            <div className={styles.card}>
              <p className={styles.step}>Paso 2</p>
              <h3 className={styles.subtitle}>Diseña tu producto</h3>
              <p className={styles.bodyTextCard}>
                Utiliza nuestro editor para diseñar el producto que elijas.
                Contamos con una gran variedad de diseños completamente
                personalizables.
              </p>
              <div className={styles.cardImageContainer}>
                <img
                  src="home/icons/product-editor.svg"
                  style={{ width: "150px" }}
                  className={styles.cardImage}
                ></img>
              </div>
            </div>
          </Reveal>

          <Reveal
            styles={{ height: "500px", display: "flex", alignItems: "center" }}
          >
            <div className={styles.card}>
              <p className={styles.step}>Paso 3</p>
              <h3 className={styles.subtitle}>Previsualiza tu producto</h3>
              <p className={styles.bodyTextCard}>
                En nuestro editor, puedes previsualizar cómo se vería tu
                producto con el diseño que hayas aplicado. Puedes descargar
                estas imágenes para compartirlas en tus redes sociales y vender
                tu producto online.
              </p>

              <div className={styles.cardImageContainer}>
                <img
                  src="home/icons/product-mockup.svg"
                  style={{ width: "150px" }}
                ></img>
              </div>
            </div>
          </Reveal>

          <Reveal
            styles={{ height: "500px", display: "flex", alignItems: "center" }}
          >
            <div className={styles.card}>
              <p className={styles.step}>Paso 4</p>
              <h3 className={styles.subtitle}>Pide tu producto</h3>
              <p className={styles.bodyTextCard}>
                Así de fácil, pide tu producto o tus productos. Tenemos
                descuentos por compras al por mayor, los cuales se aplican
                automáticamente según la cantidad que compres. Así de sencillo
                es crear productos con tu marca con Impretion.
              </p>
              <div className={styles.cardImageContainer}>
                <img
                  src="home/icons/product-delivery.svg"
                  style={{ width: "150px" }}
                ></img>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
