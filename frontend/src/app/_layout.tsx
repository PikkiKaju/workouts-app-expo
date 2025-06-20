import { useEffect, useState } from "react";

import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

import App from "./app";
import { ThemeProvider } from "providers/ThemeProvider";
import { PanelContextProvider } from "providers/PanelContextProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("assets/fonts/SpaceMono-Regular.ttf"),
    Comfortaa: require("assets/fonts/Comfortaa-VariableFont_wght.ttf"),
  });

  // Catch errors when loading fonts
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Hide splash screen after font was loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [hidden, setHidden] = useState(false);

  return (
    <>
      <ThemeProvider>
        <PanelContextProvider>
          <App />
        </PanelContextProvider>
      </ThemeProvider>
    </>
  );
}
