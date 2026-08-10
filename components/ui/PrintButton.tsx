"use client";

import React from "react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-sm transition-colors"
    >
      Print / Save as PDF
    </button>
  );
}
