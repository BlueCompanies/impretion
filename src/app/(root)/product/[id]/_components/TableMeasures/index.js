"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { RiExchangeFill } from "react-icons/ri";

// Table functionality (imperial and metric system switch)
export function TableMeasures({ productMeasures }) {
  const [isCentimeters, setIsCentimeters] = useState(true);

  const handleTableMeasures = () => {
    setIsCentimeters(!isCentimeters);
  };

  return (
    <>
      <button className={styles.measuresBtn} onClick={handleTableMeasures}>
        {isCentimeters ? <>sistema imperial</> : <>sistema metrico</>}{" "}
        <RiExchangeFill style={{ marginLeft: "5px" }} />
      </button>
      {isCentimeters ? (
        <table className={styles.table}>
          <tbody>
            <tr>
              {productMeasures?.width?.cm && (
                <th className={styles.column}>ANCHO</th>
              )}
              {productMeasures?.height?.cm && (
                <th className={styles.column}>ALTO</th>
              )}
              {productMeasures?.weight?.g && (
                <th className={styles.column}>PESO</th>
              )}
              {productMeasures?.diameter?.cm && (
                <th className={styles.column}>DIAMETRO</th>
              )}
            </tr>
            <tr>
              {productMeasures?.width?.cm && (
                <td className={styles.column}>
                  {productMeasures.width?.cm} cm
                </td>
              )}

              {productMeasures?.height?.cm && (
                <td className={styles.column}>
                  {productMeasures.height?.cm} cm
                </td>
              )}

              {productMeasures?.weight?.g && (
                <td className={styles.column}>{productMeasures.weight?.g} g</td>
              )}

              {productMeasures?.diameter?.cm && (
                <td className={styles.column}>
                  {productMeasures.diameter?.cm} cm
                </td>
              )}
            </tr>
          </tbody>
        </table>
      ) : (
        <table className={styles.table}>
          <tbody>
            <tr>
              {productMeasures?.width?.inch && (
                <th className={styles.column}>ANCHO</th>
              )}
              {productMeasures?.height?.inch && (
                <th className={styles.column}>ALTO</th>
              )}
              {productMeasures?.weight?.oz && (
                <th className={styles.column}>PESO</th>
              )}
              {productMeasures?.diameter?.inch && (
                <th className={styles.column}>DIAMETRO</th>
              )}
            </tr>
            <tr>
              {productMeasures?.width?.inch && (
                <td className={styles.column}>
                  {productMeasures.width?.inch} pulg.
                </td>
              )}

              {productMeasures?.height?.inch && (
                <td className={styles.column}>
                  {productMeasures.height?.inch} pulg.
                </td>
              )}

              {productMeasures?.weight?.oz && (
                <td className={styles.column}>
                  {productMeasures.weight?.oz} oz.
                </td>
              )}

              {productMeasures?.diameter?.inch && (
                <td className={styles.column}>
                  {productMeasures.diameter?.inch} pulg.
                </td>
              )}
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
}

// Images selector
export function ImagesScroll({ productImages }) {
  const [imageSource, setImageSource] = useState("");

  useEffect(() => {
    if (productImages) {
      setImageSource(productImages[0]);
    }
  }, [productImages]);

  return (
    <>
      <div className={styles.imageScroll}>
        {productImages?.map((imageSrc, index) => (
          <img
            key={index}
            onClick={() => setImageSource(imageSrc)}
            className={styles.productImage}
            src={imageSrc}
            alt=""
          />
        ))}
      </div>
      <div>
        <img className={styles.currentImages} src={imageSource} alt="" />
      </div>
    </>
  );
}
