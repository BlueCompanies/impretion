import EditorView from "../_components/EditorView"
import Header from "../_components/Header"
import Layers from "../_components/Layers"
import SideSection from "../_components/SideSection"
import Uploaders from "../_components/Uploaders"
import styles from "./styles.module.css"


export const runtime = 'edge'

const getProductById = async(id) => {
    try {
      const response = await fetch("https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/data/v1/action/findOne", {
        method:"POST",
        headers: {
          "Content-Type":"application/json", 
          "Access-Control-Request-Headers":"*", 
          "api-key":"lVUsfwLvFxQjkat3L5Gvd6lDM00WV1Q0j43FW57WCuXJcpZ622DYXYenNPePsmCS"
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
      return {product:data.document}
    } catch (error) {
      console.log("Error: ", error)
    }
  }

export default async function Editor({searchParams}){
    const {productId} = searchParams
    const {product} = await getProductById(productId)

    return (
        <>
        {product && 
            <div className={styles.container}>
                <Header productId={productId} productName={product.name} editor={product.editor} />

                <div className={styles.mainView}>
                
                  <SideSection product={JSON.stringify(product ? product : "")}/>

                    <div className={styles.bottomResponsiveToolSection}>
                        <Uploaders product={JSON.stringify(product)} />
                        <Layers/>
                    </div>

                    <EditorView product={JSON.stringify(product)}/>
                </div>
            </div>
        }
        </>
    )
}