import ImageLoader from "@/app/_components/Loaders/ImageLoader";
import { useWorkFlowSize } from "@/app/_store";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function DesignItemVisual({
  designUrl,
  id,
  transform,
  height,
  width,
}) {
  const workflowSize = useWorkFlowSize((state) => state.sizes);
  const [scaledWidth, setScaledWidth] = useState(width);
  const [scaledHeight, setScaledHeight] = useState(height);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const widthRatio = width / workflowSize.width;
    const heightRatio = height / workflowSize.height;
    const maxRatio = Math.max(widthRatio, heightRatio);

    if (maxRatio > 1) {
      setScaledWidth(width / maxRatio);
      setScaledHeight(height / maxRatio);
    } else {
      setScaledWidth(width);
      setScaledHeight(height);
    }
  }, [workflowSize]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div
          style={{
            display: "flex",
            position: "absolute",
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically
            background: "#fff",
            cursor: "pointer",
            maxWidth: width,
            maxHeight: height,
            transform: `${
              (transform?.translate ? transform.translate + " " : "") +
              (transform?.rotate ? transform.rotate + " " : "") +
              (transform?.scale ? transform.scale : "")
            }`,
            borderRadius: "8px",
          }}
        >
          <ImageLoader />
        </div>
      )}

      <img
        className="target"
        id={id}
        src={designUrl}
        alt="Preview"
        width={scaledWidth}
        height={scaledHeight}
        style={{
          position: "absolute",
          display: "block", // Remove 'flex' to center the image
          margin: "auto", // Center horizontally
          maxWidth: "50%",
          maxHeight: "50%",
          cursor: "pointer",
          transform: `${
            (transform?.translate ? transform.translate + " " : "") +
            (transform?.rotate ? transform.rotate + " " : "") +
            (transform?.scale ? transform.scale : "")
          }`,
          display: !loading ? "block" : "none",
        }}
        onLoad={handleImageLoad}
        draggable="false"
      />
    </>
  );
}
