import { createContext, useState } from "react";

export const UIContext = createContext();

export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <UIContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </UIContext.Provider>
  );
}
