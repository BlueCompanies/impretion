import React, { useEffect, useState } from "react";
import style from "./styles.module.css";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

// image field is for custom and diferent image fields that are into the objects
const ImageCarousel = ({ imageArray, imageField, styles }) => {
  const [sliderIndex, setSliderIndex] = useState(0);

  const nextImage = () => {
    setSliderIndex((sliderIndex + 1) % imageArray.length);
  };

  const prevImage = () => {
    setSliderIndex((sliderIndex - 1 + imageArray.length) % imageArray.length);
  };

  return (
    <div
      style={
        styles?.sliderCSS?.sliderContainer
          ? styles?.sliderCSS?.sliderContainer
          : {}
      }
    >
      {imageArray.length > 1 && (
        <button
          style={
            styles?.sliderCSS?.previousImageCSS
              ? styles?.sliderCSS?.previousImageCSS
              : {}
          }
          onClick={prevImage}
        >
          <GrFormPrevious style={{ fontSize: "20px" }} />
        </button>
      )}

      {imageArray.map((image, index) => (
        <div
          key={index}
          className={sliderIndex === index ? style.activeImage : style.slider}
        >
          <img
            style={styles.imagesCSS}
            src={imageField ? image[imageField] : image}
            alt={`Image ${index}`}
          ></img>
        </div>
      ))}

      {imageArray.length > 1 && (
        <button
          style={
            styles?.sliderCSS?.nextImageCSS
              ? styles?.sliderCSS?.nextImageCSS
              : {}
          }
          onClick={nextImage}
        >
          <GrFormNext style={{ fontSize: "20px" }} />
        </button>
      )}
    </div>
  );
};

export default ImageCarousel;
