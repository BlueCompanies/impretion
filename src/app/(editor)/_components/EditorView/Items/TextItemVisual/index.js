import { usePreviewMode } from "@/app/_store";
import React, { useEffect, useState } from "react";

const TextItemVisual = function TextItemVisual({
  fontSize,
  fontFamily,
  textContent,
  textColor,
  transformProps,
  id,
}) {
  const combinedTransform = `
  ${transformProps?.translate || ""} 
  ${transformProps?.rotate || ""} 
  ${transformProps?.scale || ""}
  `;

  return (
    <span
      className="target"
      id={id}
      style={{
        position: "absolute",
        border: "none",
        fontSize: fontSize,
        fontFamily: fontFamily,
        color: textColor,
        cursor: "pointer",
        pointerEvents: "auto",
        // Use current for the transform property
        transform: combinedTransform,
      }}
    >
      {textContent}
    </span>
  );
};

export default TextItemVisual;

// Function to parse transform styles from the given string
/*
function parseTransformStyles(styleProperties) {
  const transformStyles = {};
  const regex = /(\w+)\(([^)]+)\)/g;
  const matches = [...styleProperties.matchAll(regex)];

  matches.forEach((match) => {
    const [fullMatch, property, values] = match;
    transformStyles[property] = values;
  });

  return Object.entries(transformStyles)
    .map(([property, values]) => `${property}(${values})`)
    .join(" ");
}
*/
