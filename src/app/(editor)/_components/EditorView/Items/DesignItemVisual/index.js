export default function DesignItemVisual({ designUrl, id, transformProps }) {
  // Combine scale and rotate transformations
  const combinedTransform = `
  ${transformProps?.translate || ""} 
  ${transformProps?.rotate || ""} 
  ${transformProps?.scale || ""}
  `;

  return (
    <img
      className="target"
      src={designUrl}
      id={id}
      alt="Preview"
      style={{
        position: "absolute",
        display: "block", // Remove 'flex' to center the image
        margin: "auto", // Center horizontally
        maxWidth: "50%",
        maxHeight: "50%",
        cursor: "pointer",
        transform: combinedTransform, // Apply the combined transformations here
      }}
      draggable="false"
    />
  );
}
