import { IoIosCheckmarkCircle } from "react-icons/io";
import { FaPaintRoller } from "react-icons/fa";
import styles from "./styles.module.css";
import { ImagesScroll, TableMeasures } from "./_components/TableMeasures";


export const runtime = 'edge'

const getProductById = async(id) => {
  try {
    const response = await fetch("https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/data/v1/action/findOne", {
      method:"POST",
      headers: {
        "Content-Type":"application/json", 
        "Access-Control-Request-Headers":"*", 
        "api-key":"s5lWj1OL7r578NX3d8dcJ6TOfNrTPjQp3gfzWdF0trpmQEOX1z7DStx8eCwk7SfG"
      },
      body:JSON.stringify({
        "collection": "products",
        "database": "impretion",
        "dataSource": "Impretion",
        "filter": {
          "_id": { "$oid": id }
        }
      })
    })
    const data = await response.json()
    console.log("didi: ", data)
    return {product:data.document}
  } catch (error) {
    console.log("Error: ", error)
  }
}

// Product overview (before edition)
export default async function ProductsDetails({params}) {
  const {id} = params
  const {product} = await getProductById(id)


  return (
    <>
    {product &&
    <>
        <div className={styles.productContainer}>
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
            <div style={{background:"#dedede", padding:"15px", margin:"15px 0px 15px 0px", borderRadius:"4px"}}>
             {(
              product?.productData?.prices?.basePrice -
              (product?.productData?.prices?.basePrice *
                product?.productData?.prices?.discounts[
                  product?.productData?.prices?.discounts
                    .length - 1
                ]?.percentage) /
                100
            )?.toLocaleString()}{" "}
            COP hasta{" "}
            {product?.productData?.prices?.basePrice?.toLocaleString()}{" "}
            COP
            </div>
            <a href={`/editor?productId=${product?._id}`} style={{width:"100%", marginTop:0}}>
              <div className={styles.editorBtn}>
                Empezar a diseñar
                <FaPaintRoller style={{ marginLeft: "10px" }} />
              </div>
            </a>
          </div>
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
    }
    </>
  );
}
