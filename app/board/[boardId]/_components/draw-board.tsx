import { useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export const DrawBoard = () => {
  const [excalidrawOpen, setExcalidrawOpen] = useState(false); // State to control the visibility of Excalidraw

  // Function to handle click event for opening Excalidraw
  const handleExcalidrawOpen = () => {
    setExcalidrawOpen(true);
  };

  return (
    <div>
      <Button
        className="flex items-center justify-center fixed z-10 right-2 bottom-2 dark:text-white dark:bg-slate-900"
        onClick={handleExcalidrawOpen}
      >
        <Pencil className="mr-2 h-4 w-4" /> Open Excalidraw
      </Button>

      {excalidrawOpen && (
        <div className="absolute top-0 left-0 w-full h-full z-20">
          <Excalidraw />
        </div>
      )}
    </div>
  );
};
