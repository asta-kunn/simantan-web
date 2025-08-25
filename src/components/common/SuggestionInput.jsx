import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";

import { Input } from "@/components/ui/input";

export const SuggestionInput = ({
  fetchData,
  onSelect,
  debounceMs = 300,
  className = "",
  name,
  onChange,
  value,
  ...props
}) => {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [fetchError, setFetchError] = useState(false); // Track if last fetch failed
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const methods = useFormContext?.();
  const isUsingForm = !!(methods?.register && name);
  const error = methods?.formState?.errors?.[name];
  const isSubmitted = methods?.formState?.isSubmitted;

  useEffect(() => {
    if (value !== undefined && value !== query) {
      setQuery(value);
    }
  }, [value]);

  useEffect(() => {
    // If last fetch failed, don't fetch again until query changes
    if (fetchError) return;

    const timer = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true);
        try {
          const data = await fetchData(query);
          setSuggestions(data);
          setSelectedIndex(data.length > 0 ? 0 : -1);
          setFetchError(false); // Reset error on success
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
          setFetchError(true); // Set error so we don't fetch again until query changes
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, fetchData, debounceMs, fetchError]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setShowSuggestions(true);
    setFetchError(false); // Reset error so fetch can happen on new query

    // Propagate change to React Hook Form if onChange is provided
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const selectedValue =
      typeof suggestion === "string" ? suggestion : suggestion.label || "";
    const valueToPass =
      typeof suggestion === "string" ? suggestion : suggestion.value || "";

    setQuery(selectedValue);
    setShowSuggestions(false);

    // Propagate change to React Hook Form if onChange is provided
    if (onChange) {
      onChange(valueToPass);
    }

    if (onSelect) {
      onSelect(valueToPass);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    // Handle arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => 
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    }
    
    // Handle arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => 
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    }
    
    // Handle enter key
    else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    }
    
    // Handle escape key
    else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full">
      <Input
        {...(isUsingForm
          ? {
              ...methods.register(name, {
                onChange: (e) => {
                  handleInputChange(e);
                },
              }),
            }
          : {
              value: query,
            })}
        ref={(e) => {
          methods?.register(name)?.ref(e);
          inputRef.current = e;
        }}
        type="text"
        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none ${className}`}
        onFocus={() => setShowSuggestions(true)}
        onChange={(e) => {
          handleInputChange(e);
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        {...props}
      />
      {error && isSubmitted && <p className="text-danger-normal text-sm">{error.message}</p>}

      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg
            className="animate-spin h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          style={{ width: inputRef.current?.offsetWidth + "px" }}
        >
          {suggestions.map((suggestion, index) => {
            const suggestionText =
              typeof suggestion === "string"
                ? suggestion
                : suggestion.label || "";
            return (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ${
                  selectedIndex === index ? "bg-gray-100" : ""
                }`}
              >
                {suggestionText}
              </li>
            );
          })}
        </ul>
      )}
      {query?.length > 1 && showSuggestions && suggestions.length === 0 && (
        <ul
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
          style={{ width: inputRef.current?.offsetWidth + "px" }}
        >
          <li className="px-4 py-2 text-sm text-center">
            No suggestions found
          </li>
        </ul>
      )}
    </div>
  );
};

SuggestionInput.propTypes = {
  placeholder: PropTypes.string,
  fetchData: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  debounceMs: PropTypes.number,
  className: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
