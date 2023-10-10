import { useEffect, useState } from "react";
import ColorPicker from "./ColorPicker";
import styles from "./styles.module.css";
import { useStoreItems } from "@/app/_store";
import { BsTrashFill } from "react-icons/bs";

export default function TextItemLayer({
  textContent,
  textId,
  index,
  onSelectedCSS,
  deleteLayerHandler,
  dragStart,
}) {
  const sideIndex = useStoreItems((state) => state.sideIndex);
  const handleChangeTextInput = (newTextContent) => {
    // Update the state with the new text content
    console.log(newTextContent);
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
  return (
    <div
      style={onSelectedCSS !== "" ? onSelectedCSS : {}}
      className={styles.textContainer}
    >
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
              style={{ fontFamily: "Lucida Sans Unicode", fontSize: "15px" }}
              value="Lucida Sans Unicode, Lucida Grande, sans-serif"
            >
              Lucida Sans Unicode
            </option>
            <option
              style={{ fontFamily: "Lucida Sans Unicode", fontSize: "15px" }}
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
              style={{ fontFamily: "Franklin Gothic Medium", fontSize: "15px" }}
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
        </div>

        <div className={styles.textGroupTwo}>
          <textarea
            value={textContent}
            className={styles.textArea}
            onChange={(e) => handleChangeTextInput(e.target.value)}
          />
        </div>
        <div className={styles.textBottomConfig}>
          <button
            className={styles.trashBtn}
            onClick={() => deleteLayerHandler(index)}
          >
            <BsTrashFill
              style={{
                width: "16px",
                height: "15px",
                background: "#fff",
                width: "100%",
              }}
            />
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
  );
}
