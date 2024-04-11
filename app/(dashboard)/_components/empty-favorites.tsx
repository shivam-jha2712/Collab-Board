import Image from "next/image";

export const EmptyFavorites = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center mt-20">
      <Image
        src="/empty-favorites.svg"
        alt="Empty Favorites"
        height={160}
        width={160}
      />
      <h2 className="text-2xl font-semibold mt-6">No Favorites Found!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Try Favoriting for Something else!
      </p>
    </div>
  );
};
