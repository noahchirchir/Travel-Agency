import { useState, useEffect } from "react";

const DarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <button
      className={`fixed w-16 h-16 bottom-16 right-16 rounded-full text-white font-semibold flex items-center justify-center ${
        isDarkMode ? "bg-neutral-900" : "bg-neutral-300"
      }`}
      onClick={toggleDarkMode}
    >
      {isDarkMode ? "☀️" : "🌙"}
    </button>
  );
};

export default DarkMode;
