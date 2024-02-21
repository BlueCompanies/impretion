import Link from "next/link";
import styles from "./styles.module.css";
import connectDB from "@/app/_lib/connectDB";
import { getProducts } from "@/app/_lib/productQueries";

export default async function ProductsList() {
  await connectDB();
  const products = await getProducts();

  return (
    <>
      {products.map((product) => (
        <div key={product._id} className={styles.product}>
          <Link href={`/product/${product._id}`}>
            <div className={styles.mousepad}>
              <div className={styles.imageContainer}>
                <img
                  className={styles.originalImg}
                  src={`${product?.files?.principalImages?.normal}`}
                  alt="Mousepad"
                />
                <img
                  className={styles.designedImg}
                  src={`${product?.files?.principalImages?.over}`}
                  alt="Mousepad Hover"
                />
              </div>
              <div>
                <div className={styles.productDescription}>
                  <p className={styles.productName}>{product.name}</p>
                  <div className={styles.productFeatures}>
                    <div className={styles.body}>
                      <p>
                        {product?.measures?.width?.cm ? (
                          <>Ancho: {product?.measures?.width?.cm} cm</>
                        ) : undefined}
                      </p>
                      <p>
                        {product?.measures?.diameter?.cm ? (
                          <>
                            Diametro: {product?.measures?.diameter?.cm}
                            cm
                          </>
                        ) : undefined}
                      </p>
                      <p>
                        {product?.measures?.height?.cm ? (
                          <>Altura: {product?.measures?.height?.cm} cm</>
                        ) : undefined}
                      </p>
                      <div className={styles.productColors}>
                        Colores:
                        {product.colors.map((color, index) => (
                          <div
                            key={index}
                            style={{
                              backgroundColor: `${color}`,
                              marginLeft: "6px",
                              borderRadius: "4px",
                              height: "20px",
                              width: "20px",
                              boxShadow: "1px 1px 1px #bbbbbb",
                            }}
                          ></div>
                        ))}
                      </div>

                      <div className={styles.prices}>
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "17px",
                              width: "100%",
                            }}
                          >
                            Desde{" "}
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
                          </p>
                        </div>

                        <div
                          style={{
                            width: "100%",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "absolute",
                            bottom: 0,
                          }}
                        >
                          <p
                            style={{
                              fontSize: "12px",
                              borderTop: "1px solid #d5ae00",
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#d5ae00",
                            }}
                          >
                            ventas al por mayor con tus propios diseños
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
}