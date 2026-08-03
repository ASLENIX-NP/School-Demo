import React from "react";
import { Search, X } from "lucide-react";

export function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by teacher name, subject, department, or title..."
        aria-label="Search faculty and staff"
        className="w-full pl-11 pr-10 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:border-[#0A1628] focus:ring-2 focus:ring-[#0A1628]/10 transition-all duration-200"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          aria-label="Clear search query"
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
        >
          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
            <X className="w-3.5 h-3.5" />
          </div>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
