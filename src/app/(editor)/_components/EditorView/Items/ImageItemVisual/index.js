import { useWorkFlowSize } from "@/app/_store";
import { useEffect, useState } from "react";

export default function ImageItemVisual({
  source,
  width,
  height,
  item,
  transform,
  id,
}) {
  const workflowSize = useWorkFlowSize((state) => state.sizes);
  const [scaledWidth, setScaledWidth] = useState(width);
  const [scaledHeight, setScaledHeight] = useState(height);

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

  console.log(item);

  return (
    <img
      className="target"
      id={id}
      src={source}
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
      }}
      draggable="false"
    />
  );
}
