import { useRef, useState } from "react";
//import { SketchPicker } from "react-color";

export default function ColorPicker({
  color,
  setColor,
  setIsDraggable,
  handleChangeTextColor,
  index,
}) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const buttonRef = useRef(null);

  const swatchStyle = {
    padding: "5px",
    background: "#fff",
    borderRadius: "1px",
    boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
    display: "inline-block",
    cursor: "pointer",
  };

  const colorStyle = {
    width: "36px",
    height: "14px",
    borderRadius: "2px",
    background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
  };

  let popoverStyle = {};

  if (buttonRef.current) {
    const buttonPosition = buttonRef.current.getBoundingClientRect();
    popoverStyle = {
      position: "fixed",
      zIndex: "999",
      top: `${buttonPosition.top + 28}px`,
    };
  }
  const coverStyle = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
    setIsDraggable(false);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
    setIsDraggable(true);
  };

  const handleChange = (newColor) => {
    setColor(newColor.rgb);
    handleChangeTextColor(index);
  };

  return (
    <>
      <div>
        <div ref={buttonRef} style={swatchStyle} onClick={handleClick}>
          <div style={colorStyle} />
        </div>
        {displayColorPicker && (
          <div style={popoverStyle}>
            <div style={coverStyle} onClick={handleClose} />
            {/*<SketchPicker color={color} onChange={handleChange} />*/}
          </div>
        )}
      </div>
    </>
  );
}
