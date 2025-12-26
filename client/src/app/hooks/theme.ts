import { createTheme } from "@mui/material";
import { useEffect, useState } from "react";

export default function useTheme() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const isInitialDark = localStorage.getItem("darkMode");
    return isInitialDark ? isInitialDark === "true" : true;
  });

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");

    if (!storedMode) setDarkMode(storedMode === "true");
  }, [darkMode]);

  const paletteMode = darkMode ? "dark" : "light";

  const theme = createTheme({
    palette: {
      mode: paletteMode,
      background: {
        default: darkMode ? "#000000" : "#EEEEEE",
      },
      primary: {
        main: "#303841",
      },
      secondary: {
        main: "#FF5722",
      },
      contrastThreshold: 3,
    },
    typography: {
      fontFamily: [
        "Segoe UI",
        "Roboto",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        "Fira Sans",
        "Droid Sans",
        "Helvetica Neue",
        "sans-serif",
      ].join(","),
    },
    components: {
      MuiAppBar: {
        defaultProps: {
          position: "static",
          sx: { mb: 4, backgroundColor: "primary.dark", p: 0, borderRadius: 0 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "10px",
          },
        },
      },
    },
  });

  function handleThemeChange() {
    setDarkMode((prevMode) => {
      localStorage.setItem("darkMode", String(!prevMode));
      return !prevMode;
    });
  }

  return { darkMode, theme, handleThemeChange };
}
