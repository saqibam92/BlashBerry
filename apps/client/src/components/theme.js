// apps / client / src / components / ThemeRegistry / theme.js;

import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#AB1D79",
    },
    secondary: {
      main: "#D288B8",
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
});

export default theme;
