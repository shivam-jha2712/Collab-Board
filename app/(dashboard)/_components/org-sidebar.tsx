"use client";
// The purpose of this is that we are signifying that this is a Client side component and thereby we can use Hooks and useEffect and other inneractivity elements without a fail.

import Link from "next/link"; // Importing the Link component from Next.js for client-side navigation
import Image from "next/image"; // Importing the Image component from Next.js for optimized image rendering
import { Poppins } from "next/font/google"; // Importing the Poppins font from Google Fonts
import { LayoutDashboard, Star } from "lucide-react"; // Importing icons from the lucide-react library
import { OrganizationSwitcher } from "@clerk/nextjs"; // Importing the OrganizationSwitcher component from Clerk for organization switching
import { useSearchParams } from "next/navigation"; // Importing the useSearchParams hook from Next.js for accessing URL search parameters

import { cn } from "@/lib/utils"; // Importing utility function 'cn' for conditional classNames
import { Button } from "@/components/ui/button"; // Importing the Button component from a custom UI library

import { dark } from "@clerk/themes";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";

// Defining font styles for the sidebar using the Poppins font with specific weights and subsets
const font = Poppins({
  subsets: ["latin"], // Specifying the subset of characters for the font
  weight: ["600"], // Specifying the font weight
});

/**
 * Component representing the sidebar of the organization dashboard.
 * Provides navigation links, organization switching, and options for team and favorite boards.
 */
export const OrgSidebar = () => {
  // Accessing search parameters from the URL using the useSearchParams hook
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites"); // Extracting the 'favorites' parameter from the URL

  // This is for getting the boards from the convex
  const convex = useConvex();

  const [totalFiles, setTotalFiles] = useState<Number>();

  // useEffect(() => {
  //   activeTeam&&getFiles();
  // }, [activeTeam])

  // This is for upgrade is needed or not - Board Limit
  // const getFiles = async()=> {
  //   const result = await convex.query(api.board.getFiles,{orgId:activeTeam?._id});
  //   console.log(result);
  //   setTotalFiles(result?.length)
  // }

  return (
    // Sidebar container with fixed width and vertical layout
    <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
      {/* Logo and organization name linking to the home page */}
      <Link href="/">
        <div className="flex items-center gap-x-2">
          {/* Logo image */}
          <Image
            src="/logo.svg"
            alt="Logo"
            height={150}
            width={150}
            className="dark:invert"
          ></Image>
        </div>
      </Link>
      {/* Organization switcher component */}
      <OrganizationSwitcher
        hidePersonal // Hides personal organizations from the switcher
        // Custom appearance styles for the organization switcher
        appearance={{
          baseTheme: dark,
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              borderRadius: "8px",
              backgroundColor: "#3b3a39",
              // color: "dark" ? "white" : "black",
            },
            organizationSwitcherTrigger: {
              padding: "6px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              justifyContent: "space-between",
              // backgroundColor: "black",
            },
          },
        }}
      />
      {/* Navigation buttons for team and favorite boards */}
      <div className="space-y-1 w-full">
        {/* Button for team boards */}
        <Button
          variant={favorites ? "ghost" : "secondary"} // Conditional variant based on the 'favorites' parameter
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link href="/">
            {/* Icon and label for team boards */}
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Team Boards
          </Link>
        </Button>
        {/* Button for favorite boards */}
        <Button
          variant={favorites ? "secondary" : "ghost"} // Conditional variant based on the 'favorites' parameter
          asChild
          size="lg"
          className="font-normal justify-start px-2 w-full"
        >
          <Link
            href={{
              pathname: "/",
              query: { favorites: true }, // Adding 'favorites' parameter to the URL query
            }}
          >
            {/* Icon and label for favorite boards */}
            <Star className="h-4 w-4 mr-2" />
            Favorite Boards
          </Link>
        </Button>
      </div>

      {/* Progress Bar  */}
      <div className="h-4 w-full bg-gray-200 rounded-full mt-5">
        <div className={`h-4 w-[40%]  bg-blue-600 rounded-full`}></div>
      </div>

      <h2 className="text-[12px] mt-3 color:dark-invert">
        <strong>1</strong> out of <strong>2</strong> files used
      </h2>
      <h2 className="text-[12px] mt-1 color:dark-invert">
        Upgrade your plan for unlimited access.
      </h2>
    </div>
  );
};
