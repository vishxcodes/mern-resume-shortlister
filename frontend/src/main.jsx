import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { UIProvider } from "./context/UIContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
