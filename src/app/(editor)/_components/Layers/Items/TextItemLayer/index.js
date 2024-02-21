import { useEffect, useState } from "react";
import ColorPicker from "./ColorPicker";
import styles from "./styles.module.css";
import { useStoreItems } from "@/app/_store";
import { BsTrashFill, BsWrenchAdjustable } from "react-icons/bs";
import { FaCheck } from "react-icons/fa";

const COLORS = [
  "#ffffff",
  "#b6b5b5",
  "#98989a",
  "#646a6a",
  "#000000",
  "#eb1d26",
  "#ca1028",
  "#643b13",
  "#be8042",
  "#f88033",
  "#f16220",
  "#f4bc17",
  "#6ea748",
  "#057944",
  "#2ba5c7",
  "#73aee3",
  "#0c3f8b",
  "#8e69b0",
  "#502781",
  "#d173a7",
  "#c42a86",
];

export default function TextItemLayer({
  textContent,
  textColor,
  textId,
  index,
  onSelectedCSS,
  deleteLayerHandler,
  dragStart,
}) {
  const sideIndex = useStoreItems((state) => state.sideIndex);
  const [showColorsModal, setShowColorsModal] = useState(false);

  const handleChangeTextInput = (newTextContent) => {
    useStoreItems
      .getState()
      .setNewTextProperties({ newTextContent }, sideIndex, textId);
  };

  const handleChangeTextFamily = (newFontFamily) => {
    useStoreItems
      .getState()
      .setNewTextProperties({ newFontFamily }, sideIndex, textId);
  };

  const handleChangeTextSize = (newFontSize) => {
    useStoreItems
      .getState()
      .setNewTextProperties({ newFontSize }, sideIndex, textId);
  };

  const handleChangeTextColor = (newTextColor) => {
    console.log("as");
    useStoreItems
      .getState()
      .setNewTextProperties({ newTextColor }, sideIndex, textId);
  };

  /*
  const handleChangeTextColor = (index) => {
    const userInputViewId = layerItem[index].id;
    console.log(userInputViewId);
  };

  <ColorPicker
        color={color}
        setColor={setColor}
        setIsDraggable={setIsDraggable}
        handleChangeTextColor={handleChangeTextColor}
        index={index}
      ></ColorPicker>
   */

  const textConfig = () => {
    setShowColorsModal(!showColorsModal);
  };

  return (
    <>
      <div style={onSelectedCSS !== "" ? onSelectedCSS : {}}>
        <div className={styles.textContainer}>
          <div className={styles.textTools}>
            <div className={styles.textGroupOne}>
              <select
                className={styles.fontSelector}
                name="fonts"
                onChange={(e) => handleChangeTextFamily(e.target.value)}
              >
                <option
                  style={{ fontFamily: "Arial", fontSize: "15px" }}
                  value="Arial, Helvetica, sans-serif"
                >
                  Arial
                </option>
                <option
                  style={{ fontFamily: "Times New Roman", fontSize: "15px" }}
                  value="Times New Roman, Times, serif"
                >
                  Times New Roman
                </option>
                <option
                  style={{ fontFamily: "Verdana", fontSize: "15px" }}
                  value="Verdana, Geneva, sans-serif"
                >
                  Verdana
                </option>
                <option
                  style={{ fontFamily: "Impact", fontSize: "15px" }}
                  value="Impact, serif"
                >
                  Impact
                </option>
                <option
                  style={{ fontFamily: "Comic Sans MS", fontSize: "15px" }}
                  value="Comic Sans MS, cursive"
                >
                  Comic Sans MS
                </option>
                <option
                  style={{ fontFamily: "Tahoma", fontSize: "15px" }}
                  value="Tahoma, Geneva, sans-serif"
                >
                  Tahoma
                </option>
                <option
                  style={{
                    fontFamily: "Lucida Sans Unicode",
                    fontSize: "15px",
                  }}
                  value="Lucida Sans Unicode, Lucida Grande, sans-serif"
                >
                  Lucida Sans Unicode
                </option>
                <option
                  style={{
                    fontFamily: "Lucida Sans Unicode",
                    fontSize: "15px",
                  }}
                  value="Trebuchet MS, sans-serif"
                >
                  Trebuchet MS
                </option>
                <option
                  style={{ fontFamily: "Arial Black", fontSize: "15px" }}
                  value="Arial Black, sans-serif"
                >
                  Arial Black
                </option>
                <option
                  style={{ fontFamily: "Calibri", fontSize: "15px" }}
                  value="Calibri, sans-serif"
                >
                  Calibri
                </option>
                <option
                  style={{ fontFamily: "Century Gothic", fontSize: "15px" }}
                  value="Century Gothic, sans-serif"
                >
                  Century Gothic
                </option>
                <option
                  style={{
                    fontFamily: "Franklin Gothic Medium",
                    fontSize: "15px",
                  }}
                  value="Franklin Gothic Medium, sans-serif"
                >
                  Franklin Gothic Medium
                </option>
                <option
                  style={{ fontFamily: "Lucida Console", fontSize: "15px" }}
                  value="Lucida Console, Monaco, monospace"
                >
                  Lucida Console
                </option>
                <option
                  style={{ fontFamily: "Papyrus, fantasy", fontSize: "15px" }}
                  value="Papyrus, fantasy"
                >
                  Papyrus
                </option>

                <option
                  style={{
                    fontFamily: "MS Sans Serif, Geneva, sans-serif",
                    fontSize: "15px",
                  }}
                  value="MS Sans Serif, Geneva, sans-serif"
                >
                  MS Sans Serif
                </option>

                <option
                  style={{
                    fontFamily: "Symbol",
                    fontSize: "15px",
                  }}
                  value="Symbol"
                >
                  Symbol
                </option>
              </select>

              <select
                className={styles.fontSize}
                name="fontSize"
                onChange={(e) => handleChangeTextSize(e.target.value)}
              >
                <option value="48px">48</option>
                <option value="60px">60</option>
                <option value="76px">76</option>
                <option value="92px">92</option>
              </select>
              <button
                className={styles.trashBtn}
                onClick={() => deleteLayerHandler(index)}
              >
                <BsTrashFill
                  style={{
                    width: "20px",
                    height: "20px",
                    width: "100%",
                  }}
                />
              </button>
            </div>

            <div className={styles.textGroupTwo}>
              <textarea
                // This allow to delete the whole text in the textarea, for some reason it was not being deleted at all.
                value={textContent === null ? "" : textContent}
                className={styles.textArea}
                onChange={(e) => handleChangeTextInput(e.target.value)}
              />
            </div>
            <div className={styles.textBottomConfig}>
              <button
                style={{
                  border: "none",
                  outline: "none",
                  borderRadius: "2px",
                  height: "80%",
                  width: "100%",
                  cursor: "pointer",
                  margin: "10px",
                }}
                onClick={() => textConfig()}
              >
                <BsWrenchAdjustable style={{ fontSize: "20px" }} />
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
        {showColorsModal && (
          <div
            style={{
              position: "relative",
              zIndex: 99999999,
              right: 1,
              padding: "5px",
              margin: "6px",
              border: "1px solid #dedede",
              borderRadius: "4px",
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                position: "relative",
                zIndex: 99999999,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, 30px)", // Adjust the item width as needed
                gap: "5px", // Adjust the gap between grid items
              }}
            >
              {COLORS.map((color) => (
                <div key={color}>
                  <button
                    style={{
                      backgroundColor: color,
                      width: "30px",
                      height: "30px",
                      margin: "4px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      border: "1px solid #dedede",
                    }}
                    onClick={() => handleChangeTextColor(color)}
                  >
                    <div
                      style={{
                        display: "flex",
                        height: "100%",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0px auto",
                      }}
                    >
                      {textColor === color && (
                        <span style={{ color: "#fff" }}>
                          <FaCheck style={{ fontSize: "19px" }} />
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
                border: "1px solid #dedede",
                borderRadius: "4px 0px 0px 4px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "40px",
                }}
              >
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#d6d6d6",
                  }}
                >
                  #
                </p>
              </div>
              <input
                type="text"
                value={textColor}
                onChange={(e) => handleChangeTextColor(e.target.value)}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "1px solid #dedede",
                  fontSize: "20px",
                  padding: "5px",
                  color: "#98989a",
                }}
              ></input>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
