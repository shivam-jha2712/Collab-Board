import { Star } from "lucide-react"; // Importing the Star icon from Lucide-React library
import { cn } from "@/lib/utils"; // Importing utility function for classnames

interface FooterProps {
  // Type is React.ReactNode for making the type for div
  title: React.ReactNode; // Title of the footer
  authorLabel: string; // Label for the author
  createdAtLabel: string; // Label for the creation date
  isFavorite: boolean; // Indicates whether the item is marked as favorite
  onClick: () => void; // Function to handle click event
  disabled: boolean; // Specifies if the footer is disabled
}

/**
 * Footer Component: Renders the footer of an item.
 * @param title - The title of the footer.
 * @param authorLabel - The label for the author.
 * @param createdAtLabel - The label for the creation date.
 * @param isFavorite - Indicates whether the item is marked as favorite.
 * @param onClick - Function to handle click event.
 * @param disabled - Specifies if the footer is disabled.
 * @returns JSX.Element
 */
export const Footer = ({
  title,
  authorLabel,
  createdAtLabel,
  isFavorite,
  onClick,
  disabled,
}: FooterProps): JSX.Element => {
  // Function to handle click event
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation(); // Preventing event bubbling
    event.preventDefault(); // Preventing default action

    onClick(); // Calling the onClick function
  };

  return (
    <div className="relative bg-white p-3">
      {" "}
      {/* Footer container */}
      <p className="text-[13px] truncate max-w-[calc(100%-20px)]">
        {title} {/* Displaying the title */}
      </p>
      {/* Displaying author label and creation date label */}
      <p className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground truncate">
        {authorLabel}, {createdAtLabel}
      </p>
      {/* Button for marking as favorite */}
      <button
        disabled={disabled} // Disabling the button if disabled prop is true
        onClick={handleClick} // Handling click event with handleClick function
        className={cn(
          "opacity-0 group-hover:opacity-100 transition absolute top-3 right-3 text-muted-foreground hover:text-yellow-300", // Conditional styling for button visibility
          disabled && "cursor-not-allowed opacity-75" // Conditional styling for button disabled state
        )}
      >
        <Star
          className={cn(
            "h-4 w-4", // Setting the size of the Star icon
            isFavorite && "fill-yellow-300 text-yellow-300" // Applying blue color if isFavorite is true
          )}
        />
      </button>
    </div>
  );
};
