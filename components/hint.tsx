import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"; // Importing tooltip components
  
  /**
   * Props for the Hint component.
   * - label: The text to display in the tooltip.
   * - children: The content that triggers the tooltip.
   * - side: The side where the tooltip should be displayed (top, bottom, left, right).
   * - align: The alignment of the tooltip content relative to the trigger (start, center, end).
   * - sideOffset: The offset from the edge of the trigger along the specified side.
   * - alignOffset: The offset from the edge of the trigger in the specified alignment direction.
   */
  export interface HintProps {
    label: string;
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    alignOffset?: number;
  }
  
  /**
   * Component that provides a tooltip for the provided content.
   * It utilizes Tooltip, TooltipContent, TooltipProvider, and TooltipTrigger
   * components from the tooltip library.
   */
  export const Hint = ({
    label,
    children,
    side,
    align,
    sideOffset,
    alignOffset,
  }: HintProps) => {
    return (
      <TooltipProvider>
        {/* Wrapper for the Tooltip */}
        <Tooltip delayDuration={100}>
          {/* Trigger element for the tooltip */}
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          {/* Tooltip content */}
          <TooltipContent
            className="text-white bg-black border-black" // CSS classes for styling the tooltip content
            side={side} // Side where the tooltip should be displayed
            align={align} // Alignment of the tooltip content
            sideOffset={sideOffset} // Offset from the edge of the trigger along the specified side
            alignOffset={alignOffset} // Offset from the edge of the trigger in the specified alignment direction
          >
            {/* Label text displayed in the tooltip */}
            <p className="font-semibold capitalize">{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };
  