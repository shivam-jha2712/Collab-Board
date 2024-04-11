import {
  Circle,
  Eraser,
  MousePointer2,
  Pencil,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from "lucide-react";

import { ToolButton } from "./tool-button";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

// With these props we can work and control all of our components inside the toolbar.
interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}: ToolbarProps) => {
  return (
    <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 dark:text-black">
      <div className="bg-white rounded-md p-1.5 flex gap-y-3 flex-col items-center shadow-md dark:text-white dark:bg-slate-900">
        {/* <Pencil />
        <Square />
        <Circle />
        <ArrowUpRight />
        <Eraser /> */}
        <ToolButton
          label="Select"
          icon={MousePointer2}
          onClick={() => setCanvasState({ mode: CanvasMode.None })}
          // This is to make sure if something else is selcted but when we click here we get it back to select itself
          isActive={
            canvasState.mode === CanvasMode.None ||
            canvasState.mode === CanvasMode.Translating ||
            canvasState.mode === CanvasMode.SelectionNet ||
            canvasState.mode === CanvasMode.Pressing ||
            canvasState.mode === CanvasMode.Resizing 
          }
          // This is to keep it on by default when you open the board
        />

        {/* It is also important to note that only canvasMode.Inserting can not make sure that the selection is gauranteed for Text because all the other will also be of mode inserting. Thus, we also need layers to determine the selected component here */}
        <ToolButton
          label="Text"
          icon={Type}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Text
            })
          }
          isActive={canvasState.mode === CanvasMode.Inserting && 
          canvasState.layerType === LayerType.Text}
        />
        <ToolButton
          label="Sticky Note"
          icon={StickyNote}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Note
            })
          }
          isActive={canvasState.mode === CanvasMode.Inserting && 
          canvasState.layerType === LayerType.Note}
        />
        <ToolButton
          label="Rectangle"
          icon={Square}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Rectangle
            })
          }
          isActive={canvasState.mode === CanvasMode.Inserting && 
          canvasState.layerType === LayerType.Rectangle}
        />
        <ToolButton
          label="Ellipse"
          icon={Circle}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Inserting,
              layerType: LayerType.Ellipse
            })
          }
          isActive={canvasState.mode === CanvasMode.Inserting && 
          canvasState.layerType === LayerType.Ellipse}
        />
        {/* Pen is a bit diffrent and difficult and in this unless the mouse is not stoped or lifted it does not counts as a layer thus will be diffrrent*/}
        <ToolButton
          label="Pen"
          icon={Pencil}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Pencil,
            })
          }
          isActive={canvasState.mode === CanvasMode.Pencil }
        />
        {/* Same with the eraser as well */}
        <ToolButton
          label="Eraser"
          icon={Eraser}
          onClick={() =>
            setCanvasState({
              mode: CanvasMode.Eraser,
            })
          }
          isActive={canvasState.mode === CanvasMode.Eraser }
        />
      </div>
      <div className="bg-white rounded-md p-1.5 flex gap-y-3 flex-col items-center shadow-md dark:text-white dark:bg-slate-900">
        {/* The Undo and Redo will only be active once we have some history on the board or else it won't be working */}
        <ToolButton
          label="Undo"
          icon={Undo2}
          onClick={undo}
          isDisabled={!canUndo}
        />
        <ToolButton
          label="Redo"
          icon={Redo2}
          onClick={redo}
          isDisabled={!canRedo}
        />
      </div>
    </div>
  );
};

export const ToolbarSkeleton = () => {
  return (
    <div
      className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md
    "
    />
  );
};
