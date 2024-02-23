import { useWorkFlowSize } from "@/app/_store";
import Image from "next/image";
import { useEffect, useState } from "react";

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

  console.log(width, height);
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

  return (
    <Image
      className="target"
      src={designUrl}
      id={id}
      alt="Preview"
      width={scaledWidth}
      height={scaledHeight}
      style={{
        position: "absolute",
        display: "block", // Remove 'flex' to center the image
        margin: "auto", // Center horizontally
        cursor: "pointer",
        transform: `${
          (transform?.translate ? transform.translate + " " : "") +
          (transform?.rotate ? transform.rotate + " " : "") +
          (transform?.scale ? transform.scale : "")
        }`,
      }}
      draggable="false"
    />
  );
}
