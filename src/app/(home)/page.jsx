import styles from "./page.module.css";
import { GiColombia } from "react-icons/gi";
import { BsFillBrushFill } from "react-icons/bs";
import { AiFillShop } from "react-icons/ai";
import ProductsList from "./_components/ProductsList";
import MainHeader from "../_components/Layouts/Header";
import Presentation from "./_components/Presentation";
//import LookProductsButton from "./_components/HomePage/LookProductsButton";

export default async function Home() {
  return (
    <>
    <MainHeader  />
    <div style={{ background: '#e6e6e6', height: '90px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflowX: 'auto', overflowY:"hidden" }}>
      <div className={styles.imageContainer}>
        <img src="/home/icons/category-1.svg" className={styles.imageCategory} alt="Category 1"></img>
        <p>Apariencia</p>
      </div>
      <div className={styles.imageContainer}>
        <img src="/home/icons/category-2.svg" className={styles.imageCategory} alt="Category 2"></img>
        <p>Útiles</p>
      </div>
      <div className={styles.imageContainer}>
        <img src="/home/icons/category-3.svg" className={styles.imageCategory} alt="Category 3"></img>
        <p>Tarjetas</p>
      </div>
      <div className={styles.imageContainer}>
        <img src="/home/icons/category-4.svg" className={styles.imageCategory} alt="Category 4"></img>
        <p>Gorras</p>
      </div>
      <div className={styles.imageContainer}>
        <img src="/home/icons/category-5.svg" className={styles.imageCategory} alt="Category 5"></img>
        <p>Contenedores</p>
      </div>
    </div>
    <Presentation />

      <div style={{display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column"}}>
        <h3 style={{fontSize:"30px", margin:"25px"}}>- Elige un producto -</h3>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <ProductsList />
        </div>
      </div>
      </div>
    
    </>
  );
}
