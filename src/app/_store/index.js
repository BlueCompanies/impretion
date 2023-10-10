import { create } from "zustand";

// Current added items into array: [text, images]
export const useStoreItems = create((set) => ({
  layerItems: [],
  setLayerItems: (value) => set({ layerItems: value }),

  // Action to set new text properties (including textContent)
  setNewTextProperties: (newProperties, sideIndex, textId) =>
    set((state) => {
      return {
        layerItems: state.layerItems.map((item) => {
          if (item.id === sideIndex) {
            // This is the sideIndex you want to update
            const updatedData = item.data.map((dataItem) => {
              if (dataItem.id === textId) {
                switch (true) {
                  case !!newProperties.newTextContent:
                    return {
                      ...dataItem,
                      textContent: newProperties.newTextContent,
                    };
                  case !!newProperties.newFontFamily:
                    return {
                      ...dataItem,
                      fontFamily: newProperties.newFontFamily,
                    };
                  case !!newProperties.newFontSize:
                    // Regular expression to find the scale value
                    const regex = /scale\([^,]+,\s*[^)]+\)/g;

                    // Check if the transformProps string contains a scale property
                    if (regex.test(dataItem.transformProps)) {
                      // Replace the scale value with "scale(1, 1)"
                      dataItem.transformProps = dataItem.transformProps.replace(
                        regex,
                        "scale(1, 1)"
                      );
                    } else {
                      // Add the scale property if it doesn't exist
                      dataItem.transformProps += " scale(1, 1)";
                    }

                    return {
                      ...dataItem,
                      fontSize: newProperties.newFontSize,
                    };
                  default:
                    return dataItem;
                }
              }

              return dataItem;
            });

            // Update the item with the new data
            return {
              ...item,
              data: updatedData,
            };
          }
          return item;
        }),
      };
    }),

  deleteLayer: (sideIndex, itemId) => {
    set((state) => {
      // Find the index of the item with the matching sideIndex
      const sideItemIndex = state.layerItems.findIndex(
        (item) => item.id === sideIndex
      );

      if (sideItemIndex !== -1) {
        // If the sideIndex exists, find the index of the data item with the matching id
        const dataIndex = state.layerItems[sideItemIndex].data.findIndex(
          (dataItem) => dataItem.id === itemId
        );

        if (dataIndex !== -1) {
          // If the data item exists, remove it from the array
          const updatedData = [
            ...state.layerItems[sideItemIndex].data.slice(0, dataIndex),
            ...state.layerItems[sideItemIndex].data.slice(dataIndex + 1),
          ];

          // Create a new `layerItems` array with the updated data
          const updatedLayerItems = [...state.layerItems];
          updatedLayerItems[sideItemIndex] = {
            ...updatedLayerItems[sideItemIndex],
            data: updatedData,
          };

          return { layerItems: updatedLayerItems };
        }
      }

      return state; // If no changes were made, return the original state
    });
  },

  setLayersPosition: (index, newArray) =>
    set((state) => {
      const updatedItems = state.layerItems.map((item) => {
        if (item.id === index) {
          // Update the data array for the matching index
          return {
            ...item,
            data: newArray,
          };
        }
        return item;
      });
      return { layerItems: updatedItems };
    }),

  setNewLayerItem: (id, newData) =>
    set((state) => {
      console.log(state.layerItems);
      // Find the index of the item with the matching id
      const itemIndex = state.layerItems.findIndex((item) => item.id === id);
      if (itemIndex !== -1) {
        // If an item with the same id exists, add newData to the beginning of its data array
        const updatedItems = [...state.layerItems];
        updatedItems[itemIndex].data = [
          newData,
          ...updatedItems[itemIndex].data,
        ];
        return { layerItems: updatedItems };
      } else {
        return {
          layerItems: [
            ...state.layerItems,
            {
              id: id,
              data: [newData],
            },
          ],
        };
      }
    }),

  setNewStyles: (id, transformProps, sideIndex) =>
    set((state) => {
      return {
        layerItems: state.layerItems.map((item) => {
          if (item.id === sideIndex) {
            // This is the sideIndex you want to update
            const updatedData = item.data.map((dataItem) => {
              if (dataItem.id === id) {
                // Update the data object with the matching id
                const newDataItem = {
                  ...dataItem,
                  transformProps,
                };
                return newDataItem;
              }
              return dataItem;
            });

            // Update the item with the new data
            return {
              ...item,
              data: updatedData,
            };
          }
          return item;
        }),
      };
    }),

  selectedLayers: [],
  setSelectedLayers: (value) => set({ selectedLayers: value }),

  sideIndex: 0,
  setSideIndex: (value) => set({ sideIndex: value }),
}));

export const useDesignPanelHandler = create((set) => ({
  designPanel: false,
  setDesignPanel: (value) => set({ designPanel: value }),
}));

export const usePreviewMode = create((set) => ({
  isPreviewing: false,
  setPreviewMode: (value) =>
    set((state) => ({
      isPreviewing: value,
    })),
}));

export const useCurrentUser = create((set) => ({
  user: {},
  setUser: (value) => set((state) => ({ user: value })),
}));

export const useOrderFormSent = create((set) => ({
  formSubmit: false,
  setFormSubmit: (value) => set((state) => ({ formSubmit: value })),
}));

/*
  setGeneralProperties: (id, newProperties) =>
    set((state) => {
      const updatedItems = state.layerItems.map((item) => {
        if (item.id === id) {
          // Update the textContent field
          return { ...item, justifyContent: newProperties.justifyContent };
        }
        return item;
      });
      return { layerItems: updatedItems };
    }),
  */
