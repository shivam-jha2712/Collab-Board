"use client";
// Another Important fact about use client is that it does not means only client side rendering only instead it means it is not a server component but is a client side component

import { useEffect, useState } from "react";

import { RenameModal } from "@/components/modals/rename-modal";

export const ModalProvider = () => {
  // This is a little check over here
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
// The whole component will make sure that the component will only rendered on server side 

  //   The above line means that the rendering starts on server side but it can't be shown on server side or else will cause the Hydration error.

  if (!isMounted)
  {
    return null;
  }
    return (
      <>
        <RenameModal />
      </>
    );
};
