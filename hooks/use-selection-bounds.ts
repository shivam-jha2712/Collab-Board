// Importing the shallow function from the Liveblocks library, which allows for shallow comparison of objects.
import { shallow } from "@liveblocks/react";

// Importing types related to layers and their dimensions.
import { Layer, XYWH } from "@/types/canvas";

// Importing custom hooks for accessing Liveblocks storage and self-presence.
import { useStorage, useSelf } from "@/liveblocks.config";

// Function to calculate the bounding box dimensions based on the provided layers.
const boundingBox = (layers: Layer[]): XYWH | null => {
  // Retrieving the first layer.
  const first = layers[0];

  // If no layers are present, return null.
  if (!first) {
    return null;
  }

  // Initializing variables to store bounding box coordinates.
  let left = first.x;
  let right = first.x + first.width;
  let top = first.y;
  let bottom = first.y + first.height;

  // Iterating through the remaining layers to find the bounding box dimensions.
  for (let i = 1; i < layers.length; i++) {
    const { x, y, width, height } = layers[i];

    // Updating left coordinate if current layer's x-coordinate is smaller.
    if (left > x) {
      left = x;
    }

    // Updating right coordinate if current layer's x + width is larger.
    if (right < x + width) {
      right = x + width;
    }

    // Updating top coordinate if current layer's y-coordinate is smaller.
    if (top > y) {
      top = y;
    }

    // Updating bottom coordinate if current layer's y + height is larger.
    if (bottom < y + height) {
      bottom = y + height;
    }
  }

  // Returning the calculated bounding box dimensions.
  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
};

// Custom hook for calculating the bounding box of selected layers.
export const useSelectionBounds = () => {
  // Accessing the self-presence data to get the selection.
  const selection = useSelf((me) => me.presence.selection);

  // Using Liveblocks storage to retrieve the layers data based on selection.
  return useStorage((root) => {
    // Filtering out selected layers from the root layers.
    const selectedLayers = selection
      .map((layerId) => root.layers.get(layerId)!) // Mapping layer IDs to layer data.
      .filter(Boolean); // Removing any falsy values (null or undefined).

    // Calculating the bounding box dimensions for the selected layers.
    return boundingBox(selectedLayers);
  }, shallow); // Using shallow comparison for storage updates.
};
