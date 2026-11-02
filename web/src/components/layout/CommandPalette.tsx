import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const actions = [
  { label: "Go to Dashboard", path: "/dashboard" },
  { label: "View all Decisions", path: "/dashboard/decisions" },
  { label: "Create New Decision", path: "/dashboard/decisions/new" },
  { label: "View Patterns", path: "/dashboard/patterns" },
  { label: "Open Library", path: "/dashboard/library" },
  { label: "Go to Settings", path: "/dashboard/settings" }
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredActions = actions.filter((action) =>
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  function handleSelect(path: string) {
    navigate(path);
    setIsOpen(false);
    setQuery("");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-ink/20 backdrop-blur-sm">
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg bento shadow-neu-flat bg-cream overflow-hidden"
          >
            <input
              autoFocus
              type="text"
              placeholder="Type a command or search..."
              className="w-full bg-transparent border-b border-ink/10 px-6 py-5 text-lg text-ink outline-none placeholder:text-inkFaint"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <p className="p-4 text-sm text-inkSoft text-center">No results found.</p>
              ) : (
                filteredActions.map((action) => (
                  <button
                    key={action.path}
                    onClick={() => handleSelect(action.path)}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-ink hover:bg-ink/5 transition-colors flex items-center justify-between"
                  >
                    {action.label}
                    <span className="text-xs text-inkFaint">Jump to</span>
                  </button>
                ))
              )}
            </div>
            
            <div className="border-t border-ink/10 px-6 py-3 text-xs font-bold text-inkFaint flex justify-between">
              <span>Navigation</span>
              <span>ESC to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}