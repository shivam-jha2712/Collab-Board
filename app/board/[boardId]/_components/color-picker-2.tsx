"use client";

import { colorToCss } from "@/lib/utils";
import { Color } from "@/types/canvas";

interface ColorPickerProps {
  onChange: (color: Color) => void;
}

export const ColorPicker = ({ onChange }: ColorPickerProps) => {
  return (
    // <div className="absolute top-[93%] -translate-x-[-25%] 
    // flex flex-wrap gap-2 items-center max-w-[1000px] pr-2 mr-2">
    <div className="absolute top-[93%] left-1/2 transform -translate-x-1/2 flex  gap-2 items-center max-w-[1400px] pr-2 mr-2">
      <ColorButton color={{ r: 0, g: 0, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 128, g: 128, b: 128 }} onClick={onChange} />
      <ColorButton color={{ r: 192, g: 192, b: 192 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 255, b: 255 }} onClick={onChange} />
      <ColorButton color={{ r: 128, g: 0, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 0, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 128, g: 128, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 255, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 0, g: 128, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 0, g: 255, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 0, g: 128, b: 128 }} onClick={onChange} />
      <ColorButton color={{ r: 0, g: 255, b: 255 }} onClick={onChange} />
      <ColorButton color={{ r: 0, g: 0, b: 128 }} onClick={onChange} />
      <ColorButton color={{ r: 0, g: 0, b: 255 }} onClick={onChange} />
      <ColorButton color={{ r: 128, g: 0, b: 128 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 0, b: 255 }} onClick={onChange} />
      <ColorButton color={{ r: 165, g: 42, b: 42 }} onClick={onChange} />
      <ColorButton color={{ r: 210, g: 105, b: 30 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 165, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 255, g: 215, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 34, g: 139, b: 34 }} onClick={onChange} />
      <ColorButton color={{ r: 0, g: 100, b: 0 }} onClick={onChange} />
      <ColorButton color={{ r: 70, g: 130, b: 180 }} onClick={onChange} />
      <ColorButton color={{ r: 100, g: 149, b: 237 }} onClick={onChange} />
    </div>
  );
};

// THis is going to send the selected color to the lastUsedColor
interface ColorButtonProps {
  onClick: (color: Color) => void;
  color: Color;
}

const ColorButton = ({ onClick, color }: ColorButtonProps) => {
  return (
    <button
      className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
      onClick={() => onClick(color)}
    >
      <div
        className="h-8 w-8 rounded-md border border-neutral-300"
        style={{ background: colorToCss(color) }}
      />
    </button>
  );
};
