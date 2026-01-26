import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="max-w-3xl mx-auto px-6 -mt-10">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for courses..."
          className="w-full pl-12 pr-6 py-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
}
