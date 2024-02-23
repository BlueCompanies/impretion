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
      <div style={{width:"100%", background:"#e6e6e6", height:"90px", display:"flex", justifyContent:"center", alignItems:"center"}}>
        <div className={styles.imageContainer}>
          <img src="/home/icons/category-1.svg" className={styles.imageCategory}></img>
          <p>Apariencia</p>
        </div>
        <div className={styles.imageContainer}>
        <img src="/home/icons/category-2.svg" className={styles.imageCategory}></img>
        <p>Útiles</p>
        </div>
        <div className={styles.imageContainer}>
        <img src="/home/icons/category-3.svg" className={styles.imageCategory}></img>
        <p>Tarjetas</p>
        </div>
        <div className={styles.imageContainer}>
        <img src="/home/icons/category-4.svg" className={styles.imageCategory}></img>
        <p>Gorras</p>
        </div>
        <div className={styles.imageContainer}>
        <img src="/home/icons/category-5.svg" className={styles.imageCategory}></img>
        <p>Contenedores</p>
        </div>
      </div>
    <Presentation />
    
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <ProductsList />
        </div>
      </div>
    
    </>
  );
}
