"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";
import TextItemLayer from "./Items/TextItemLayer";
import ImageItemLayer from "./Items/ImageItemLayer";
import { usePreviewMode, useStoreItems } from "@/app/_store";
import DesignItemLayer from "./Items/DesignItemLayer";

// Editor layers manager
export default function Layers() {
  const [isDragging, setIsDragging] = useState();
  const [data, setData] = useState([]);
  const [showLayersPanel, setShowLayersPanel] = useState(false);
  const containerRef = useRef();

  // gets the current layers
  const layers = useStoreItems((state) => state.layerItems);

  // the current side of the product example: front: 0, reverse: 1 etc..
  const sideIndex = useStoreItems((state) => state.sideIndex);

  // updates the old array depending on the layers position
  const newUpdatedArray = useStoreItems((state) => state.setLayersPosition);

  const isPreviewing = usePreviewMode((state) => state.isPreviewing);

  const selectedLayers = useStoreItems((state) => state.selectedLayers);

  // sets the new array and saves it on data, so the drag system doesnt breaks.
  useEffect(() => {
    const currentLayers = layers.find((item) => item.id === sideIndex);
    setData(currentLayers?.data);
  }, [layers, sideIndex]);

  const detectLeftButton = (e) => {
    e = e || window.event;
    if ("buttons" in e) {
      return e.buttons == 1;
    }

    let button = e.which || e.button;
    return button === 1;
  };

  const dragStart = (e, index) => {
    if (!detectLeftButton()) return; // Only use left mouse click

    setIsDragging(index);
    const container = containerRef.current;
    const items = [...container.childNodes];
    const dragItem = items[index];
    const itemsBelowDragItem = items.slice(index + 1);
    const notDragItems = items.filter((_, i) => i !== index);
    const dragData = data[index];
    let newData = data;

    // getBoundingClientRect of dragItem
    const dragBoundingRect = dragItem?.getBoundingClientRect();

    // distance between two card
    const space =
      items[1]?.getBoundingClientRect()?.top -
      items[0]?.getBoundingClientRect()?.bottom;

    // set style for dragItem when mouse down
    dragItem.style.position = "fixed";
    dragItem.style.zIndex = 5000;
    dragItem.style.width = dragBoundingRect.width + "px";
    dragItem.style.height = dragBoundingRect.height + "px";
    dragItem.style.top = dragBoundingRect.top + "px";
    dragItem.style.left = dragBoundingRect.left + "px";
    dragItem.style.cursor = "grabbing";

    // create alternate div element when dragItem position is fixed
    const div = document.createElement("div");
    div.id = "div-temp";
    div.style.width = dragBoundingRect.width + "px";
    div.style.height = dragBoundingRect.height + "px";
    div.style.pointerEvents = "none";
    container.appendChild(div);

    // move the element below dragItem
    // distance to be moved
    const distance = dragBoundingRect.height + space;

    itemsBelowDragItem.forEach((item) => {
      item.style.transform = `translateY(${distance}px)`;
    });

    // get the original coordinates of the mouse pointer
    let x = e.clientX;
    let y = e.clientY;

    // perform the function on hover
    document.onpointermove = dragMove;
    function dragMove(e) {
      // Calculate the distance the mouse pointer has traveled
      // original coordinates minus current coordinates
      const posX = e.clientX - x;
      const posY = e.clientY - y;

      // Move item
      dragItem.style.transform = `translate(${posX}px, ${posY}px)`;

      // swap position and data
      notDragItems.forEach((item) => {
        // check two elements is overlapping
        const rect1 = dragItem.getBoundingClientRect();
        const rect2 = item.getBoundingClientRect();

        let isOverlapping =
          rect1.y < rect2.y + rect2.height / 2 &&
          rect1.y + rect1.height / 2 > rect2.y;

        if (isOverlapping) {
          // Swap position card
          if (item.getAttribute("style")) {
            item.style.transform = "";
            index++;
          } else {
            item.style.transform = `translateY(${distance}px)`;
            index--;
          }

          // swap data
          newData = data.filter((item) => item.id !== dragData.id);
          newData.splice(index, 0, dragData);
        }
      });
    }

    // finish onpointerDown event
    document.onpointerup = dragEnd;
    function dragEnd() {
      document.onpointerup = "";
      document.onpointermove = "";
      setIsDragging(undefined);
      dragItem.style = "";
      container.removeChild(div);
      items.forEach((item) => (item.style = ""));
      newUpdatedArray(sideIndex, newData);
      setData(newData);
    }
  };

  const deleteLayerHandler = (index) => {
    // Get the id of the item to be deleted
    const itemId = layers[sideIndex].data[index].id;
    // Call the deleteLayer action to delete the item by id
    useStoreItems.getState().deleteLayer(sideIndex, itemId);
  };

  return (
    <>
      <div className={styles.nonResponsiveDropZone}>
        {!isPreviewing && (
          <div className={styles.dropZone} ref={containerRef}>
            {data?.map((item, index) => (
              <div key={item.id}>
                {/* Edit the layers <TextItemLayer/> <ImageItemLayer/> so they change visually */}
                <div
                  className={`${isDragging === index ? styles.dragging : ""}`}
                >
                  {item?.inputType === "text" && (
                    <TextItemLayer
                      textFamily={item.textFamily}
                      onSelectedCSS={
                        selectedLayers.includes(item.id)
                          ? {
                              border: "4px solid #c7c8c9",
                            }
                          : ""
                      }
                      fontSize={item.fontSize}
                      textContent={item.textContent}
                      dragStart={(e) => dragStart(e, index)}
                      textId={item.id}
                      index={index}
                      textColor={item.textColor}
                      deleteLayerHandler={deleteLayerHandler}
                    />
                  )}
                  {item?.inputType === "image" && (
                    <ImageItemLayer
                      onSelectedCSS={
                        selectedLayers.includes(item.id)
                          ? { backgroundColor: "#A8A9AA" }
                          : ""
                      }
                      source={item.source}
                      imageName={item.imageName}
                      dragStart={(e) => dragStart(e, index)}
                      index={index}
                      resolution={{
                        width: item.imageWidth,
                        height: item.imageHeight,
                      }}
                      imageExtension={item.imageExtension}
                      deleteLayerHandler={deleteLayerHandler}
                    />
                  )}
                  {item?.inputType === "design" && (
                    <DesignItemLayer
                      onSelectedCSS={
                        selectedLayers.includes(item?.id)
                          ? { backgroundColor: "#A8A9AA" }
                          : ""
                      }
                      designUrl={item.designUrl}
                      designName={item.designName}
                      index={index}
                      dragStart={(e) => dragStart(e, index)}
                      deleteLayerHandler={deleteLayerHandler}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.responsiveDropZone}>
        {showLayersPanel && (
          <div className={styles.dragAndDropZone}>
            {!isPreviewing && (
              <div className={styles.dropZone} ref={containerRef}>
                {data?.length > 0 ? (
                  data?.map((item, index) => (
                    <div key={item.id}>
                      {/* Edit the layers <TextItemLayer/> <ImageItemLayer/> so they change visually */}
                      <div
                        className={`${
                          isDragging === index ? styles.dragging : ""
                        }`}
                      >
                        {item?.inputType === "text" && (
                          <TextItemLayer
                            textFamily={item.textFamily}
                            onSelectedCSS={
                              selectedLayers.includes(item.id)
                                ? {
                                    backgroundColor: "#c7c8c9",
                                  }
                                : ""
                            }
                            fontSize={item.fontSize}
                            textContent={item.textContent}
                            dragStart={(e) => dragStart(e, index)}
                            textId={item.id}
                            index={index}
                            deleteLayerHandler={deleteLayerHandler}
                            textColor={item.textColor}
                          />
                        )}
                        {item?.inputType === "image" && (
                          <ImageItemLayer
                            onSelectedCSS={
                              selectedLayers.includes(item.id)
                                ? { backgroundColor: "#A8A9AA" }
                                : ""
                            }
                            source={item.source}
                            imageName={item.imageName}
                            dragStart={(e) => dragStart(e, index)}
                            index={index}
                            resolution={{
                              width: item.imageWidth,
                              height: item.imageHeight,
                            }}
                            imageExtension={item.imageExtension}
                            deleteLayerHandler={deleteLayerHandler}
                          />
                        )}
                        {item?.inputType === "design" && (
                          <DesignItemLayer
                            onSelectedCSS={
                              selectedLayers.includes(item?.id)
                                ? { backgroundColor: "#A8A9AA" }
                                : ""
                            }
                            designUrl={item.designUrl}
                            designName={item.designName}
                            index={index}
                            dragStart={(e) => dragStart(e, index)}
                            deleteLayerHandler={deleteLayerHandler}
                          />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <p style={{ padding: "10px" }}>No tienes ninguna capa.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!isPreviewing && (
          <button
            className={styles.layersBtn}
            onClick={() => setShowLayersPanel(!showLayersPanel)}
          >
            Capas
          </button>
        )}
      </div>
    </>
  );
}
