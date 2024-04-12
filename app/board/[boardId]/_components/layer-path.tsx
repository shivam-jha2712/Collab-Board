import { getSvgPathFromStroke } from "@/lib/utils";
import { useplannerTheme } from "@/store/use-theme-modal";
import getStroke from "perfect-freehand";

interface PathProps {
  x: number;
  y: number;
  points: number[][];
  fill: string;
  onPointerDown?: (e: React.PointerEvent) => void;
  stroke?: string;
}

export const Path = ({
  x,
  y,
  points,
  fill,
  onPointerDown,
  stroke,
}: PathProps) => {
  const plannerTheme = useplannerTheme((state: any) => state.plannerTheme);

  return (
    <path
      className="drop-shadow-md "
      onPointerDown={onPointerDown}
      d={getSvgPathFromStroke(
        getStroke(points, {
          size: 12,
          thinning: 0.5,
          smoothing: 0.5,
          streamline: 0.5,
        })
      )}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      x={0}
      y={0}
      // fill={"#020817"}
      // fill={plannerTheme}
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
    />
  );
};
