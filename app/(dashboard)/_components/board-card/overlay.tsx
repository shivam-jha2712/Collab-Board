export const Overlay = () => {
  return (
    <div className="opacity-0 group-hover:opacity-50 transition-opacity h-full w-full bg-black"></div>
    // This has a className of group which is also present in that of index.tsx of board-card thus they function in sync in terms of CSS if they have the same className
  );
};
