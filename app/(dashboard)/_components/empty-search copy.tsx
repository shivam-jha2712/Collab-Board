import Image from "next/image";

export const EmptySearch = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center mt-10">
      <Image
        src="/empty-search.svg"
        alt="Empty Search"
        height={160}
        width={160}
      />
      <h2 className="text-2xl font-semibold mt-6">No Results Found!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Try Searching for Something else!
      </p>
    </div>
  );
};
