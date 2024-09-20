
import React, { createContext, useContext, useState } from "react";

export type panelToggled = true | false;

interface PanelContextType {
  panelToggled: panelToggled
  togglePanel: () => void
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export const PanelContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [panelToggled, setPanelToggled] = useState<panelToggled>(true);

  const togglePanel = () => {
    const newTheme = panelToggled === true ? false : true;
    setPanelToggled(newTheme);    
  }

  return (
    <PanelContext.Provider value={{ panelToggled, togglePanel }} >
      {children}
    </PanelContext.Provider>
  );
};

export const usePanelContext = () => {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};