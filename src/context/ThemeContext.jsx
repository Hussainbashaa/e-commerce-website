import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark" // default dark matte
  );

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    // Apply base body colors
    if (theme === "dark") {
      document.body.style.background =
        "linear-gradient(145deg, #0a0a0a, #1a1a1a)";
      document.body.style.color = "#f5f5f5";
    } else {
      document.body.style.background =
        "linear-gradient(145deg, #fafafa, #e6e6e6)";
      document.body.style.color = "#111111";
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        className={`transition-all duration-700 ${
          theme === "dark"
            ? "bg-[#0d0d0d] text-gray-100"
            : "bg-[#f2f2f2] text-gray-900"
        }`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
