"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  Side,
  XYWH,
} from "@/types/canvas";

import { nanoid } from "nanoid";

import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";
import {
  useHistory,
  useCanRedo,
  useCanUndo,
  useMutation,
  useStorage,
  useOthersMapped,
  useSelf,
  // useMutation is a hook that can be used to broadcast or stream changes to the group of people connected inside of the liveblocks room
} from "@/liveblocks.config";
import { CursorPresence } from "./cursors-presence";
import { DrawBoard } from "./draw-board";
import {
  colorToCss,
  connectionIdToColor,
  findIntersectingLayersWithReactangle,
  penPointsToPathLayer,
  pointerEventToCanvasPoint,
  resizeBounds,
} from "@/lib/utils";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
import { ModeToggle } from "@/components/mode-toggle";
import { Hint } from "@/components/hint";
import { cursorTo } from "readline";
import { Path } from "./layer-path";
import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce";
import { useDeleteLayers } from "@/hooks/use-delete-layers";

const MAX_LAYERS = 1000;

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
  // This is for the Layers that are to be put in
  const layerIds = useStorage((root) => root.layerIds);

  // The layerIds are going to be information regarding the actions that we are going to perform on the canvas and it also determines the layerType thus helping us to know whether to show rectangle, square, ellipse or a path.

  // For my pencil movement to be seen
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);

  // This is for the Canvas State inside the board and to justify if some data is present or not
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.None,
  });

  // Setting up the camera
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, scale: 1 });

  // Results in black color in normal mode  pencil color
  const [lastUsedColor, setLastUsedColor] = useState<Color>({
    r: 255,
    g: 255,
    b: 255,
  });

  // THis is to insert layers within the board itself
  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layertype:
        | LayerType.Ellipse
        | LayerType.Rectangle
        | LayerType.Text
        | LayerType.Note,
      position: Point
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) {
        return;
      }

      const liveLayersIds = storage.get("layerIds");
      // for Ids we will be using nano ids
      const layerId = nanoid();
      const layer = new LiveObject({
        type: layertype,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastUsedColor,
      });
      liveLayersIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.None });
    },
    [lastUsedColor]
  );

  // The undo and redo will only work if there exists some history on the board
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  useDisableScrollBounce();

  // Function for Translation/Moving the Layer

  const translateSelectedLayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Translating) {
        return;
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");

      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);

        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }
      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [canvasState]
  );

  // This is for unSelecting the layers
  const unSelectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true });
    }
  }, []);

  // Note :  UseMutation is used when we want the changes to be viewed to everyone on the board simultaneously
  // Function to set up the selection net
  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, current: Point, origin: Point) => {
      const layers = storage.get("layers").toImmutable();
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });

      const ids = findIntersectingLayersWithReactangle(
        layerIds,
        layers,
        origin,
        current
      );

      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  const startMultiSelection = useCallback((current: Point, origin: Point) => {
    if (
      Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) >
      5
      // This condition is a threshold to trigger selectionNet when it is clicked and then dragged across
    ) {
      setCanvasState({
        mode: CanvasMode.SelectionNet,
        origin,
        current,
      });
    }
  }, []);

  // This is for continueDrawing Function
  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { pencilDraft } = self.presence;

      if (
        canvasState.mode !== CanvasMode.Pencil ||
        e.buttons !== 1 ||
        pencilDraft == null
      ) {
        return;
      }

      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, e.pressure]],
      });
    },
    [canvasState.mode]
  );

  // This is for the inserting of the drawn path by the pointer from starting till it has been up
  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const { pencilDraft } = self.presence;

      if (
        pencilDraft == null ||
        pencilDraft.length < 1 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        setMyPresence({ pencilDraft: null });
        return;
      }

      const id = nanoid();
      liveLayers.set(
        id,
        new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor))
      );

      const liveLayersIds = storage.get("layerIds");
      liveLayersIds.push(id);

      setMyPresence({ pencilDraft: null });
      setCanvasState({ mode: CanvasMode.Pencil });
    },
    [lastUsedColor]
  );

  // function for Starting the drawing
  const startDrawing = useMutation(
    ({ setMyPresence }, point: Point, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        penColor: lastUsedColor,
      });
    },
    [lastUsedColor]
  );

  // Function for resizing the layer
  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return;
      }
      // This is found from the utils for the function of resizng
      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(self.presence.selection[0]);

      if (layer) {
        layer.update(bounds);
      }
    },
    [canvasState]
  );

  // This is for the selection Net for resizing
  const onResizeHandlePointerDown = useCallback(
    (corner: Side, initialBounds: XYWH) => {
      history.pause();
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      });
    },
    [history]
  );

  // Here what we are doing is panning the camera based on the wheel delta

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      // Prevent default behavior (scrolling)
      e.preventDefault();

      // Check if the ctrl key is pressed (indicating zoom)
      if (e.ctrlKey) {
        // Calculate the new scale factor based on wheel movement
        const newScale = camera.scale * (e.deltaY > 0 ? 0.9 : 1.1);

        // Update the camera state with the new scale
        setCamera((prevCamera) => ({
          ...prevCamera,
          scale: newScale,
        }));
      } else {
        // Handle panning by adjusting camera position
        setCamera((prevCamera) => ({
          x: prevCamera.x - e.deltaX,
          y: prevCamera.y - e.deltaY,
          scale: 1,
        }));
      }
    },
    [camera.scale] // Include scale dependency
  );

  // This is to detremine the movement of thhe cursor w.r.t to the intial presence and it will also be used for resizing as well
  const onPointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = pointerEventToCanvasPoint(e, camera);
      // Now the thing is that the current needs to be calculated by the pointer event, and the state of the camera and state of the canvas as well

      // This is now for selection of range of layers all at once
      if (canvasState.mode === CanvasMode.Pressing) {
        startMultiSelection(current, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SelectionNet) {
        updateSelectionNet(current, canvasState.origin);
      }

      // Now we would work for translating which means the movement on selection and dragging
      else if (canvasState.mode === CanvasMode.Translating) {
        translateSelectedLayers(current);
      }

      // This works for resizing
      else if (canvasState.mode === CanvasMode.Resizing) {
        resizeSelectedLayer(current);
      }

      // This is working for pencil drawing while moving
      else if (canvasState.mode === CanvasMode.Pencil) {
        continueDrawing(current, e);
      }

      setMyPresence({ cursor: current });
    },
    [
      canvasState,
      resizeSelectedLayer,
      camera,
      translateSelectedLayers,
      continueDrawing,
      startMultiSelection,
      updateSelectionNet,
    ]
  );

  // This is to deselect the layer once we click outside of the given layer
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      // TODO: Add case for drawing

      if (canvasState.mode === CanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }

      setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    },
    [canvasState.mode, camera, setCanvasState, startDrawing]
  );

  // This is to make sure when the cursor is out of Canvas it is no longer shown there
  const onPointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  // This is going to help us terminate the position of layer

  const onPointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera);

      // This is the supporting logic for deselcting a particular component
      if (
        canvasState.mode === CanvasMode.None ||
        canvasState.mode === CanvasMode.Pressing
      ) {
        // console.log("UNSELECT");
        unSelectLayers();

        setCanvasState({
          mode: CanvasMode.None,
        });
      }

      // This is regarding the pencil based drawing
      else if (canvasState.mode === CanvasMode.Pencil) {
        insertPath();
      }

      // This is for the insertion of layers when pointer is clicked up for once
      else if (canvasState.mode === CanvasMode.Inserting) {
        insertLayer(canvasState.layerType, point);
      } else {
        setCanvasState({
          mode: CanvasMode.None,
        });
      }

      history.resume();
    },
    [
      setCanvasState,
      camera,
      canvasState,
      history,
      insertLayer,
      unSelectLayers,
      insertPath,
    ]
  );

  const selections = useOthersMapped((other) => other.presence.selection);

  // This is to make the selections visible for the given data and make sure that when was the selection made
  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (
        canvasState.mode === CanvasMode.Pencil ||
        canvasState.mode === CanvasMode.Inserting
      ) {
        return;
      }

      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, camera);

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
      }

      setCanvasState({ mode: CanvasMode.Translating, current: point });
    },
    [setCanvasState, camera, history, canvasState.mode]
  );

  // This is for color While selection of an element itself

  const layerIdsToColorSelection = useMemo(() => {
    const layerIdsToColorSelection: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
      }
    }

    return layerIdsToColorSelection;
  }, [selections]);

  // This is for enabling keyboard shortcuts for our project
  const deleteLayers = useDeleteLayers();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "Delete":
          deleteLayers();
          break;

        case "z": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
            break;
          }
        }
        case "y": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              history.undo();
            } else {
              history.redo();
            }
            break;
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [deleteLayers, history]);

  return (
    // Board Color : TODO : Create dots in the background as grid
    <main className="h-full w-full relative touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canUndo={canUndo}
        canRedo={canRedo}
        undo={history.undo}
        redo={history.redo}
      />
      <Hint label="Switch Theme">
        <div className="fixed z-10 bottom-2 left-2 flex items-center justify-center">
          <ModeToggle />
        </div>
      </Hint>

      <DrawBoard />
      {/* This svg component is the whole drawing place and where all the cursors would be loaded */}

      {/* This will be having the contents for changing the color and will also be used for deletion */}
      <SelectionTools camera={camera} setLastUsedColor={setLastUsedColor} />

      <svg
        className="h-[100vh] w-[100vw]"
        // onWheel={onZoom}
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
      >
        {/* Also the svg and g are going to have functionality of camera positioning on scroll for later */}
        <g
          style={{
            transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {layerIds.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />

          {canvasState.mode === CanvasMode.SelectionNet &&
            canvasState.current != null && (
              <rect
                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                x={Math.min(canvasState.origin.x, canvasState.current.x)}
                y={Math.min(canvasState.origin.y, canvasState.current.y)}
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              />
            )}
          <CursorPresence />
          {pencilDraft != null && pencilDraft.length > 0 && (
            <Path
              points={pencilDraft}
              fill={colorToCss(lastUsedColor)}
              x={0}
              y={0}
            />
          )}
        </g>
      </svg>
    </main>
  );
};

/*




     


*/
