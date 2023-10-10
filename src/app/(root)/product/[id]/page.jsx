import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaPaintRoller } from "react-icons/fa";
import styles from "./styles.module.css";
import { getProductById } from "@/app/_lib/productQueries";
import connectDB from "@/app/_lib/connectDB";
import { ImagesScroll, TableMeasures } from "./_components/TableMeasures";


// Product overview (before edition)
export default async function ProductsDetails({ params }) {
    const {id} = params
    await connectDB();
    const product = await getProductById(id)
 

  return (
    <>
      <div className={styles.productContainer}>
        <div>
        <div className={styles.productPresentation}>
          <div className={styles.productImages}>
            <div className={styles.imageContainer}>
              <ImagesScroll productImages={product?.files?.images}/>
            </div>
          </div>
          <div className={styles.productDescription}>
            <h1 className={styles.productName}>{product?.name}</h1>
            <p className={styles.productAbout}>{product?.about}</p>
            <ul className={styles.productFeatures}>
              {product?.features?.map((feature, index) => (
                <li key={index} className={styles.productFeature}>
                  <IoIosCheckmarkCircle
                    style={{
                      color: "rgba(20,131,255,1)",
                      width: "20px",
                      minWidth: "20px",
                    }}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: "15px" }}>Colores: </h2>
              <ul
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {product?.colors?.map((color, index) => (
                  <li
                    key={index}
                    style={{
                      marginTop: "5px",
                      marginLeft: "5px",
                      width: "25px",
                      height: "25px",
                      backgroundColor: color,
                      boxShadow: "1px 1px 1px #4e4e4e",
                      listStyleType: "none",
                      borderRadius: "3px",
                      border: "1px solid #4e4e4e",
                    }}
                  ></li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>
        {/* Access to the current product overview with query params */}
            <a href={`/editor?productId=${product?._id}`}>
         
              <div className={styles.editLink}>
                Empezar a diseñar
                <FaPaintRoller style={{ marginLeft: "10px" }} />
              </div>
    
            </a>
        </div>
        
        <div className={styles.productInfo}>
          <h2
            style={{ marginTop:"10px", fontSize: "30px", display: "flex", alignItems: "center" }}
          >
            Materiales
          </h2>
          <ul>
            {product?.materials?.map((material, index) => (
              <li key={index} className={styles.productMaterial}>
                <IoIosCheckmarkCircle
                  style={{
                    color: "rgba(20,131,255,1)",
                    width: "20px",
                    minWidth: "20px",
                  }}
                />
                <span>{material}</span>
              </li>
            ))}
          </ul>
    
          <h2
            style={{marginTop:"10px",
              fontSize: "30px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Medidas 
          </h2>
            <TableMeasures productMeasures={product.measures}/>
          
        </div>
      </div>
  
    </>
  );
}
