import { BsTrashFill } from "react-icons/bs";
import styles from "./styles.module.css";

export default function DesignItemLayer({
  source,
  onSelectedCSS,
  index,
  dragStart,
  deleteLayerHandler,
  imageExtension,
  resolution,
}) {
  return (
    <div
      style={onSelectedCSS !== "" ? onSelectedCSS : {}}
      className={styles.imageContainer}
    >
      <div className={styles.imageTools}>
        <div className={styles.groupOne}>
          <div className={styles.designItem}>
            <img className={styles.imageItem} src={source} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <p>
              <span
                style={{
                  backgroundColor: "#19a7ce",
                  color: "#fff",
                  padding: "4px 5px 4px 5px",
                  margin: "7px",
                  borderRadius: "5px",
                  fontSize: "12px",
                }}
              >
                {imageExtension}
              </span>
            </p>
            <div style={{}} className={styles.imageData}>
              <span style={{ fontSize: "12px" }}>
                {resolution.width}x{resolution.height}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.imageBottomConfig}>
          <button
            className={styles.trashBtn}
            onClick={() => deleteLayerHandler(index)}
          >
            <BsTrashFill
              style={{
                width: "16px",
                height: "15px",
                background: "#fff",
                width: "100%",
              }}
            />
          </button>
        </div>
      </div>
      <div
        className={styles.dragHandler}
        onPointerDown={(e) => dragStart(e, index)}
      >
        <img
          className={styles.handlerImage}
          draggable="false"
          src="/handler.svg"
        ></img>
      </div>
    </div>
  );
}
