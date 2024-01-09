import { useEffect, useState } from "react";
//once the user starts typing ans stops for 5 milliseconds the function is called and the state is saved into the cache,
//then everytime the user starts typing again the editor clears the cache and then saves the new state.

export function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
