// Get the current product by its ID

import styles from "./styles.module.css"
import Header from "../_components/Header"
import Uploaders from "../_components/Uploaders"
import Layers from "../_components/Layers"
import BuyModalWindow from "../_components/Uploaders/BuyModal"
import EditorView from "../_components/EditorView"
import connectDB from "@/app/_lib/connectDB"
import { getProductById } from "@/app/_lib/productQueries"


export default async function Editor({searchParams}){
    const {productId} = searchParams
    await connectDB()
    const product = await getProductById(productId)


    return (
    <div className={styles.container}>
        <Header productId={productId} productName={product.name} editor={product.editor} />

        <div className={styles.mainView}>
            <div className={styles.rightToolSection}>
                <Uploaders product={JSON.stringify(product)} />
                <Layers/>
            </div>

            <div className={styles.bottomResponsiveToolSection}>
                <Uploaders product={JSON.stringify(product)} />
                <Layers/>
                <BuyModalWindow currentProduct={JSON.stringify(product)}/>
            </div>

            <EditorView product={JSON.stringify(product)}/>
        </div>
    </div>
    )
}