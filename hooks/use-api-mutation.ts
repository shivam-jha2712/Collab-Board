import { useState } from "react"; // Importing useState hook from React library
import { useMutation } from "convex/react"; // Importing useMutation hook from Convex for making mutations

/**
 * Custom hook for handling API mutations.
 * It takes a mutation function as input and returns a mutate function and a pending state.
 */
export const useApiMutation = (mutationFunction: any) => {
  // State variable to track pending state
  const [pending, setPending] = useState(false);

  // Using useMutation hook to execute mutation
  const apiMutation = useMutation(mutationFunction);

  // Function to execute mutation with payload
  const mutate = (payload: any) => {
    // Set pending state to true when mutation starts
    setPending(true);
    // Execute mutation and handle pending state
    return apiMutation(payload)
      .finally(() => setPending(false)) // Set pending state to false when mutation completes
      .then((result) => {
        return result; // Return mutation result
      })
      .catch((error) => {
        throw error; // Throw error if mutation fails
      });
  };

  // Return mutate function and pending state
  return {
    mutate, // Function to execute mutation
    pending, // State variable indicating pending state
  };
};
