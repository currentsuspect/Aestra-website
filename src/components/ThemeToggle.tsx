import { memo } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export const ThemeToggle = memo(() => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="w-9 h-9 rounded-md flex items-center justify-center text-muted hover:text-fg hover:bg-surface-2 transition-colors"
    >
      <span className="relative w-4 h-4">
        <Sun
          className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
            isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
          }`}
          strokeWidth={1.6}
        />
        <Moon
          className={`absolute inset-0 w-4 h-4 transition-all duration-200 ${
            isDark ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
          }`}
          strokeWidth={1.6}
        />
      </span>
    </button>
  );
});
