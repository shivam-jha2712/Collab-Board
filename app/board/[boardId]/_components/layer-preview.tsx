"use client";

import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/types/canvas";
import { memo } from "react";
import { Rectangle } from "./layer-rectangle";
import { Ellipse } from "./layer-ellipse";
import { Text } from "./layer-text";
import { Note } from "./layer-note";
import { Path } from "./layer-path";
import { colorToCss } from "@/lib/utils";

interface LayerPreviewProps {
  id: string;
  key: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const LayerPreview = memo(
  ({ id, key, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
    // This is to find out that on which layer are we currently on.
    const layer = useStorage((root) => root.layers.get(id));

    if (!layer) {
      return null;
    }

    // Now the cool part is that for every category of layer we just need to switch the layer type which means it can be reused

    switch (layer.type) {
      case LayerType.Path:
        return (
          <Path
            key={id}
            points={layer.points}
            onPointerDown={(e) => onLayerPointerDown(e, id)}
            x={layer.x}
            y={layer.y}
            fill={layer.fill ? colorToCss(layer.fill) : "#000"}
            stroke={selectionColor}
          />
        );
      case LayerType.Ellipse:
        return (
          <Ellipse
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Text:
        return (
          <Text
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      case LayerType.Note:
        return (
          <Note
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );

      case LayerType.Rectangle:
        return (
          <Rectangle
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        );
      default:
        console.warn("Unknown Layer Type");
        return null;
    }
  }
);

LayerPreview.displayName = "LayerPreview";
