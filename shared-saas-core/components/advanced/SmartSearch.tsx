"use client";

import { ArrowRight, Command, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn, debounce } from "../../utils";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: string;
  href: string;
  icon?: string;
}

interface SmartSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => Promise<SearchResult[]>;
  onSelect?: (result: SearchResult) => void;
  className?: string;
  hotkey?: string;
}

export function SmartSearch({
  placeholder = "Search...",
  onSearch,
  onSelect,
  className,
  hotkey = "k",
}: SmartSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Debounced search
  const debouncedSearch = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim() || !onSearch) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchResults = await onSearch(searchQuery);
      setResults(searchResults);
      setSelectedIndex(0);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === hotkey) {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }

      // Close with Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setQuery("");
        setResults([]);
      }

      // Navigate results
      if (isOpen && results.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev,
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, hotkey]);

  // Scroll selected into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (result: SearchResult) => {
    if (onSelect) {
      onSelect(result);
    } else {
      window.location.href = result.href;
    }
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2",
          "bg-white text-gray-500 text-sm hover:bg-gray-50",
          "transition-colors",
          className,
        )}
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">{placeholder}</span>
        <kbd className="hidden items-center gap-1 rounded border border-gray-200 bg-gray-100 px-2 py-0.5 font-semibold text-gray-500 text-xs sm:inline-flex">
          <Command className="h-3 w-3" />
          {hotkey.toUpperCase()}
        </kbd>
      </button>
    );
  }

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border border-gray-200 py-3 pr-10 pl-12",
            "bg-white focus:outline-none focus:ring-2 focus:ring-blue-500",
            "text-gray-900 placeholder-gray-400",
          )}
          autoFocus
        />
        <button
          onClick={() => {
            setIsOpen(false);
            setQuery("");
            setResults([]);
          }}
          className="-translate-y-1/2 absolute top-1/2 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {(results.length > 0 || loading || query) && (
        <div className="absolute top-full z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
          {loading && (
            <div className="p-4 text-center text-gray-500 text-sm">
              Searching...
            </div>
          )}

          {!loading && results.length === 0 && query && (
            <div className="p-4 text-center text-gray-500 text-sm">
              No results found
            </div>
          )}

          {!loading && results.length > 0 && (
            <div ref={resultsRef} className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className={cn(
                    "w-full px-4 py-3 text-left transition-colors hover:bg-gray-50",
                    "flex items-center gap-3",
                    index === selectedIndex && "bg-blue-50",
                  )}
                >
                  {result.icon && (
                    <span className="text-xl">{result.icon}</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900">
                      {result.title}
                    </div>
                    {result.description && (
                      <div className="mt-0.5 text-gray-500 text-sm">
                        {result.description}
                      </div>
                    )}
                    <div className="mt-1 text-gray-400 text-xs">
                      {result.category}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
