export default function ImageItemVisual({ source, transformProps, id }) {
  const combinedTransform = `
  ${transformProps?.translate || ""} 
  ${transformProps?.rotate || ""} 
  ${transformProps?.scale || ""}
  `;

  return (
    <img
      className="target"
      id={id}
      src={source}
      alt="Preview"
      style={{
        position: "absolute",
        display: "block", // Remove 'flex' to center the image
        margin: "auto", // Center horizontally
        maxWidth: "50%",
        maxHeight: "50%",
        cursor: "pointer",
        transform: combinedTransform,
      }}
      draggable="false"
    />
  );
}
