// 2. “npm i query-string”  and  “npm i @uidotdev/usehooks”
// 3. And to add the Input based UI component we need “ npx shadcn-ui@latest add input”

// This could simply be used to make a seach input component in any application of next js.

"use client";
import qs from "query-string"; // Importing the query-string library for URL manipulation
import { Search } from "lucide-react"; // Importing the Search icon from lucide-react
import { useDebounce } from "@uidotdev/usehooks"; // Importing the useDebounce hook from a custom library
import { useRouter } from "next/navigation"; 
// 1. Importing the useRouter hook from Next.js for client-side routing

// 2. Whenever You are using useRouter do no import is from /router as it does not works inside the app folder and it only works in the pages folder

import { ChangeEvent, useEffect, useState } from "react"; // Importing necessary hooks from React

import { Input } from "@/components/ui/input"; // Importing the Input component from a custom UI library

/**
 * Component representing a search input field with debounced search functionality.
 * Uses the useDebounce hook to delay search requests.
 */
export const SearchInput = () => {
  const router = useRouter(); // Accessing the router instance for client-side routing
  const [value, setValue] = useState(""); // State to manage the input value
  const debouncedValue = useDebounce(value, 500); // Debounced value for delayed search requests

  // Function to handle input value changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value); // Update the input value
  };

  // Effect to execute search when debounced value changes
  useEffect(() => {
    // Constructing the search query URL
    const url = qs.stringifyUrl({
      url: "/", // Base URL
      query: {
        search: debouncedValue, // Adding the search query parameter
      },
    }, { skipEmptyString: true, skipNull: true });

    // Redirecting to the search query URL
    router.push(url);
  }, [debouncedValue, router]); // Dependencies for the effect

  return (
    <div className="w-full relative">
      {/* Search icon */}
      <Search
        className="absolute top-1/2 left-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
      />
      {/* Input field for searching */}
      <Input
        className="w-full max-w-[516px] pl-9 font-sans"
        placeholder="Search boards"
        onChange={handleChange} // Handling input value changes
        value={value} // Current value of the input field
      />
    </div>
  );
};
