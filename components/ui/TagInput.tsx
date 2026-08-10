import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

export function TagInput({ tags = [], onChange, placeholder = "Add a skill...", suggestions = [] }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s)
  ).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      <div className="min-h-[42px] p-1.5 flex flex-wrap gap-2 items-center bg-white border border-slate-200 rounded-lg focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-indigo-100"
          >
            {tag}
            <button 
              type="button" 
              onClick={() => removeTag(index)}
              className="text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-full p-0.5 transition-colors focus:outline-none"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        
        <div className="flex-1 min-w-[120px] flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="w-full flex-1 bg-transparent border-none focus:outline-none focus:ring-0 p-1 text-sm text-slate-700 placeholder:text-slate-400"
          />
          <button 
            type="button"
            onClick={() => addTag(inputValue)}
            disabled={!inputValue.trim()}
            className="ml-2 p-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 disabled:opacity-50 disabled:hover:bg-indigo-50 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showSuggestions && inputValue.trim().length > 0 && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          <ul className="max-h-48 overflow-y-auto py-1">
            {filteredSuggestions.map((suggestion, idx) => (
              <li 
                key={idx}
                onClick={() => addTag(suggestion)}
                className="px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 cursor-pointer font-medium"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
