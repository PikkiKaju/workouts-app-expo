import React, { useState, useRef } from "react";
import { View, Pressable, StyleSheet, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Menu, { MenuItem } from './Menu';

// Props for the MenuButton component
interface MenuButtonProps {
  theme: "light" | "dark";
  menuItems: MenuItem[];
  iconSize?: number;
}

const defaultIconSize = 30;

// Main MenuButton component
export default function MenuButton({
  theme,
  menuItems,
  iconSize = defaultIconSize
}: MenuButtonProps) {
  const [menuToggled, setMenuToggled] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const menuWrapRef = useRef<View>(null) as React.RefObject<View>;
  const buttonRef = useRef<View>(null);

  const [buttonLayout, setButtonLayout] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

  const menuToggleDuration = 200;

  function toggleMenu() {
    if (!menuToggled && Platform.OS !== 'web') {
      buttonRef.current?.measureInWindow((x, y, width, height) => {
        setButtonLayout({ x, y, width, height });
        setMenuToggled(true);
      });
    } else {
      setMenuToggled(prev => !prev);
    }
  }

  // Close the menu and execute any action if provided
  function closeMenu(onHideCallback?: () => void) {
    setMenuToggled(false);
    // Execute the callback if provided
    if (onHideCallback) {
      // On web, the menu isn't in a modal, so callback can execute immediately.
      if (Platform.OS === 'web') {
        setTimeout(onHideCallback, menuToggleDuration);
      }
    }
  }

  return (
    <View ref={menuWrapRef} style={styles.menuWrap}>
      <Pressable
        ref={buttonRef}
        onPress={toggleMenu}
        onHoverIn={() => Platform.OS === 'web' && setIsButtonHovered(true)}
        onHoverOut={() => Platform.OS === 'web' && setIsButtonHovered(false)}
        style={[
          styles.menuButton,
          menuToggled ? (theme === "light" ? styles.menuButtonActiveLight : styles.menuButtonActiveDark) : null,
          isButtonHovered && !menuToggled && Platform.OS === 'web' ? (theme === "light" ? styles.menuButtonHoverLight : styles.menuButtonHoverDark) : null
        ]}
      >
        <MaterialCommunityIcons
          name="dots-horizontal"
          size={iconSize}
          color={theme === "light" ? "black" : "white"}
        />
      </Pressable>

      {menuToggled && (
        <Menu
          onClose={closeMenu}
          menuItems={menuItems}
          theme={theme}
          buttonLayout={buttonLayout}
          iconSize={iconSize}
          menuWrapRef={menuWrapRef}
          menuToggleDuration={menuToggleDuration}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  menuWrap: {
    position: 'relative',
  },
  menuButton: {
    borderRadius: 5,
    padding: 2,
  },
  menuButtonHoverLight: {
    backgroundColor: "#EEE",
  },
  menuButtonHoverDark: {
    backgroundColor: "#555",
  },
  menuButtonActiveLight: {
    backgroundColor: "#CCC",
  },
  menuButtonActiveDark: {
    backgroundColor: "#444",
  },
});
