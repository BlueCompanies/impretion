import styles from "@/app/page.module.css";
import { GiColombia } from "react-icons/gi";
import { BsFillBrushFill } from "react-icons/bs";
import { AiFillShop } from "react-icons/ai";
import ProductsList from "./_components/Home/ProductsList";
import MainHeader from "./_components/Layouts/Header";
//import LookProductsButton from "./_components/HomePage/LookProductsButton";

export default async function Home() {
  return (
    <>
     <MainHeader  />
      <section className={styles.sectionShape}>
        <img
          className={styles.homepageImg}
          style={{ width: "600px", height: "600px" }}
          src="homepage-design.png"
        ></img>
        <div>
          <p className={styles.textTitle}>DISEÑA Y VENDE</p>
          <p className={styles.textTitle2}>PRODUCTOS PERSONALIZADOS</p>

          <div className={styles.descriptions}>
            <div className={styles.anchorOne}>
              <BsFillBrushFill
                style={{ height: "25px", width: "25px", marginRight: "2px" }}
              />
              <p className={styles.anchorText}>
                Edita diferentes productos con nuestro editor.
              </p>
            </div>

            <div className={styles.anchorOne}>
              <GiColombia
                style={{ height: "25px", width: "25px", marginRight: "2px" }}
              />
              <p className={styles.anchorText}>Envios a todo Colombia.</p>
            </div>

            <div className={styles.anchorOne}>
              <AiFillShop
                style={{ height: "25px", width: "25px", marginRight: "2px" }}
              />
              <p className={styles.anchorText}>
                Comienza tu tienda en línea sin inversión alguna.
              </p>
            </div>

           
          </div>
        </div>
      </section>

      <div className={styles.bodyContainer}>
        <img
          className={styles.miniGuide}
          src="mini-guide.png"
          draggable="false"
        ></img>
      </div>
      <div>
        <div id="productsSection" className={styles.gridContainer}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <h2 style={{ margin: "auto", fontSize: "40px" }}>Catálogo</h2>
            <p style={{ fontSize: "15px", marginBottom: "25px" }}>
              Te ofrecemos una amplia variedad de productos personalizables para
              que puedas crear tu propio negocio en el área que más te apasione.
            </p>
          </div>
          <div className={styles.grid}>
            <ProductsList />
          </div>
        </div>
      </div>
    </>
  );
}
