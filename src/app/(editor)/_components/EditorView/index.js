"use client";

import { useEffect, useRef, useState } from "react";
import Moveable from "react-moveable";
import Selecto from "react-selecto";
import {
  useDesignPanelHandler,
  useOrderFormSent,
  usePreviewMode,
  useStoreItems,
} from "@/app/_store";
import ImageItemVisual from "./Items/ImageItemVisual";
import TextItemVisual from "./Items/TextItemVisual";
import styles from "./styles.module.css";

import DesignItemVisual from "./Items/DesignItemVisual";
import Designs from "../Designs";
import ProductDesign from "../ProductDesign";

export default function EditorView({ product }) {
  const moveableRef = useRef(null);
  const selectoRef = useRef(null);
  const [targets, setTargets] = useState([]);

  // get the current array of layers
  const layerItems = useStoreItems((state) => state.layerItems);
  const [visualItems, setVisualItems] = useState([]);

  const isPreviewing = usePreviewMode((state) => state.isPreviewing);

  // the current side of the product example: front: 0, reverse: 1 etc..
  const sideIndex = useStoreItems((state) => state.sideIndex);

  //const layer = useStoreItems((state) => state.layerItems);
  const setSelectedLayers = useStoreItems((state) => state.setSelectedLayers);

  const layers = useStoreItems((state) => state.layerItems);
  const setLayerItems = useStoreItems((state) => state.setLayerItems);

  // shows the design panel of the designs provided with IA
  const showPanel = useDesignPanelHandler((state) => state.designPanel);
  const setPanelHandler = useDesignPanelHandler(
    (state) => state.setDesignPanel
  );
  const formState = useOrderFormSent((state) => state.formSubmit);

  const [propsTransform, setPropsTransform] = useState([]);

  const [currentId, setCurrentId] = useState("");

  useEffect(() => {
    setLayerItems([]);
  }, []);

  useEffect(() => {
    const visualLayers = layerItems.find((item) => item.id === sideIndex);
    setVisualItems(visualLayers?.data);
  }, [layerItems, sideIndex]);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (!e.target.closest("#board")) {
        // Clicked outside the "BOARD" div, clear selected items
        setTargets([]);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!formState) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave this page?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formState]);

  const stylePropsChange = (itemId, drag) => {
    const regexTranslate = /translate\([^)]+\)/;
    const regexScale = /scale\([^)]+\)/;
    const rotationRegex = /\s*rotate\([^)]+\)/;

    const matchTranslate = drag.match(regexTranslate);
    const matchScale = drag.match(regexScale);
    const matchRotation = drag.match(rotationRegex);

    // Initialize new objects for transformation values
    let newTransform = {};

    if (matchTranslate) {
      newTransform.translate = matchTranslate[0];
    }

    if (matchScale) {
      newTransform.scale = matchScale[0];
    }

    if (matchRotation) {
      newTransform.rotate = matchRotation[0];
    }

    // Check if propsTransform already contains an object with the currentId
    const existingIndex = propsTransform.findIndex(
      (item) => item.id === currentId[0]
    );

    // If the id doesn't exist, add a new object
    if (existingIndex === -1) {
      setPropsTransform([
        ...propsTransform,
        { id: currentId[0], transform: newTransform },
      ]);
    } else {
      // If the id exists, update the transform value of the existing object
      const updatedPropsTransform = [...propsTransform];
      updatedPropsTransform[existingIndex].transform = newTransform;
      setPropsTransform(updatedPropsTransform);
    }
  };

  useEffect(() => {
    // Extract the IDs from the DOM elements
    const extractedIDs = targets
      .map((target) => {
        if (target instanceof HTMLElement) {
          const id = target.id;
          return id || null; // Return the id or null if it's empty
        }
        return null; // Not an HTMLElement
      })
      .filter(Boolean);

    setSelectedLayers(extractedIDs);
    setCurrentId(extractedIDs);
  }, [targets]);

  useEffect(() => {}, [currentId]);

  const handleShowPanel = () => {
    setPanelHandler(false);
  };

  return (
    <>
      <div className={styles.boardContainer} id="board">
        <div style={{ display: isPreviewing ? "none" : "block" }}>
          {showPanel && (
            <div className={styles.designsPanel}>
              <button
                onClick={handleShowPanel}
                className={styles.mobileCloseBtn}
              >
                <span>X</span>
                <span>cerrar</span>
              </button>
              <Designs />
            </div>
          )}
        </div>
        {/* If is in preview mode the selecto gets disabled */}
        {!isPreviewing && (
          <Selecto
            ref={selectoRef}
            dragContainer={"#board"}
            selectableTargets={["#board .target"]}
            onDragStart={(e) => {
              const moveable = moveableRef.current;
              const target = e.inputEvent.target;
              if (
                moveable?.isMoveableElement(target) ||
                targets.some((t) => t === target || t?.contains(target))
              ) {
                e.stop();
              }
            }}
            onSelectEnd={(e) => {
              const moveable = moveableRef.current;

              if (e.isDragStart) {
                e.inputEvent.preventDefault();
                moveable.waitToChangeTarget().then(() => {
                  moveable.dragStart(e.inputEvent);
                });
              }

              // Ensure only one target is selected
              const selectedElement = e.selected[0];
              const previouslySelected = document.querySelector(".selected");

              if (
                previouslySelected &&
                previouslySelected !== selectedElement
              ) {
                previouslySelected.classList.remove("selected");
              }

              if (selectedElement) {
                selectedElement.classList.add("selected");
              }

              // Set the selected target
              setTargets([selectedElement]);
            }}
            /*
            hitRate={0}
            ratio={0}
            draggable={true}
            scalable={true}
            selectByClick={true}
            //onSelect={handleSelectItem}
            selectFromInside={true}
            toggleContinueSelect={["shift"]}
            */
          />
        )}

        <ProductDesign product={JSON.parse(product)}>
          {/* If is in preview mode the moveable gets disabled */}
          {!isPreviewing && (
            <Moveable
              target={targets} // This also ensures that the final image will not have select box
              ref={moveableRef}
              draggable={true}
              throttleDrag={1}
              edgeDraggable={false}
              dragFocusedInput={true}
              startDragRotate={0}
              throttleDragRotate={0}
              snapGridWidth={5}
              snapGridHeight={5}
              isDisplayGridGuidelines={true}
              scalable={true}
              rotatable={true}
              keepRatio={false}
              snappable={true}
              checkInput={true}
              contentEditable={true}
              elementGuidelines={[".container"]}
              rotationPosition={"top"}
              snapDirections={{
                top: true,
                left: true,
                bottom: true,
                right: true,
              }}
              verticalGuidelines={[50, 150, 250, 450, 550]}
              horizontalGuidelines={[0, 100, 200, 400, 500]}
              /*
              warpable={true}
              renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
              onWarp={(e) => {
                e.target.style.transform = e.transform;
              }}
               */

              onDragStart={(e) => {
                if (
                  ["input", "select"].indexOf(e.target.tagName.toLowerCase()) >
                  -1
                ) {
                  e.stopDrag();
                }
              }}
              onDrag={(e) => {
                e.target.style.cssText += e.cssText;
                stylePropsChange(e.target.id, e.target.style.cssText);
              }}
              onScale={(e) => {
                e.target.style.transform = e.drag.transform;
                stylePropsChange(e.target.id, e.target.style.transform);
              }}
              onRotate={(e) => {
                e.target.style.transform = e.drag.transform;
                stylePropsChange(e.target.id, e.target.style.transform);
              }}
              onRenderGroup={(e) => {
                e.events.forEach((ev) => {
                  ev.target.style.cssText += ev.cssText;
                });
                stylePropsChange(e.target.id, e.target.style.transform);
              }}
              onClickGroup={(e) => {
                selectoRef.current?.clickTarget(e.inputEvent, e.inputTarget);
              }}
            />
          )}

          {/* .slice() and .reverse() so the layer system coincide with the visual system */}
          {visualItems?.length > 0 &&
            visualItems
              .slice()
              .reverse()
              .map((item) => {
                if (item.inputType === "image") {
                  return (
                    <ImageItemVisual
                      key={item.id}
                      id={item.id}
                      transformProps={item.transformProps}
                      source={item.source}
                      item={item}
                      // Iterate over the visual items and pass the appropriate transform data to each TextItemVisual component.
                      // We find the corresponding transform object from the propsTransform array based on the item's id.
                      // If a matching transform object is found, it's passed to the TextItemVisual component.
                      // This ensures that each TextItemVisual receives its own transform data, allowing individual item transformations to be applied correctly.
                      width={item.imageWidth}
                      height={item.imageHeight}
                      transform={
                        propsTransform.find(
                          (transform) => transform.id === item.id
                        )?.transform
                          ? propsTransform.find(
                              (transform) => transform.id === item.id
                            )?.transform
                          : item.transform
                      }
                    />
                  );
                }
                if (item.inputType === "text") {
                  return (
                    <TextItemVisual
                      key={item.id}
                      id={item.id}
                      transformProps={item.transformProps}
                      fontSize={item.fontSize}
                      fontFamily={item.fontFamily}
                      textContent={item.textContent}
                      textColor={item.textColor}
                      transform={
                        propsTransform.find(
                          (transform) => transform.id === item.id
                        )?.transform
                          ? propsTransform.find(
                              (transform) => transform.id === item.id
                            )?.transform
                          : item.transform
                      }
                    />
                  );
                }

                if (item.inputType === "design") {
                  return (
                    <>
                      <DesignItemVisual
                        key={item.id}
                        designUrl={item.designUrl}
                        transformProps={item.transformProps}
                        id={item.id}
                        width={item.width}
                        height={item.height}
                        transform={
                          propsTransform.find(
                            (transform) => transform.id === item.id
                          )?.transform
                            ? propsTransform.find(
                                (transform) => transform.id === item.id
                              )?.transform
                            : item.transform
                        }
                      />
                    </>
                  );
                }
                return null; // Add this to handle other cases
              })}
        </ProductDesign>
      </div>
    </>
  );
}
