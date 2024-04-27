"use client";
import { useRef, useState } from "react";
import { MdAddAPhoto } from "react-icons/md";

export default function ImageUploader() {
  const imageSelector = useRef(null);
  const [uploadedImage, setUploadedImage] = useState();

  const imageUploaderHandler = () => {
    imageSelector.current.click();
  };

  return (
    <>
      <input
        type="file"
        style={{ display: "none" }}
        ref={imageSelector}
      ></input>
      <div
        style={{
          border: "2px dotted #8C52FF",
          height: "150px",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#E7DAFF",
          marginBottom: "10px",
        }}
        onClick={imageUploaderHandler}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <p
            style={{
              color: "#555555",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            Imagen de tu mascota
          </p>
          <MdAddAPhoto style={{ color: "#555555", fontSize: "24px" }} />
        </div>
        <div>
          <img
            src="/shops/icons/upload-image-example.webp"
            style={{ width: "150px" }}
          ></img>
        </div>
      </div>
    </>
  );
}
