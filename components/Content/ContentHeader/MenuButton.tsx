import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "../../UI/Themed"; 
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors"; 

// Define the structure for a menu item
export interface MenuItem {
  text: string;
  onPressAction: () => void;
  isSeparator?: boolean; 
}

// Props for the internal MenuRowButton
interface MenuRowButtonProps {
  item: MenuItem;
  theme: "light" | "dark";
  closeMenu: () => void;
}

function MenuRowButton({ item, theme, closeMenu }: MenuRowButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (item.isSeparator) {
    return (
      <View style={styles.menuElem}>
        <View style={[
          styles.menuLine,
          theme === 'light' ? { backgroundColor: "#AAA" } : { backgroundColor: "#555" }
        ]}></View>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => {
        item.onPressAction();
        closeMenu();
      }}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.menuElem,
        isHovered ? theme === "light" ? { backgroundColor: "#DDD" } : { backgroundColor: "#555" } : null,
        pressed ? theme === "light" ? { backgroundColor: "#CCC" } : { backgroundColor: "#666" } : null
      ]}
    >
      <Text theme={theme} style={styles.menuText}>{item.text}</Text>
    </Pressable>
  );
}

// Props for the main MenuButton component
interface MenuButtonProps {
  theme: "light" | "dark";
  menuItems: MenuItem[];
  iconSize?: number;
}

const defaultIconSize = 30;

export default function MenuButton({
  theme,
  menuItems,
  iconSize = defaultIconSize
}: MenuButtonProps) {
  const [menuToggled, setMenuToggled] = useState(false);

  function toggleMenu() {
    setMenuToggled(!menuToggled);
  }

  function closeMenu() {
    setMenuToggled(false);
  }

  return (
    <View style={styles.menuWrap}>
      <Pressable
        onPress={toggleMenu}
        style={[
          styles.menuButton,
          menuToggled ? theme === "light" ? { backgroundColor: "#CCC" } : { backgroundColor: "#444" } : null
        ]}
      >
        <MaterialCommunityIcons
          name="dots-horizontal"
          size={iconSize}
          color={theme === "light" ? "black" : "white"}
        />
      </Pressable>
      {menuToggled && (
        <View style={[
          styles.menu,
          { top: iconSize + 5 }, // Position below the button based on icon size
          theme === "light" ? { backgroundColor: "#FBFBFB" } : { backgroundColor: "#3a3a3a" }, // Slightly adjusted dark background
          theme === "light" ? { borderColor: Colors.global.tableLines } : { borderColor: "#555" } // Adjusted dark border
        ]}>
          {menuItems.map((item, index) => (
            <MenuRowButton
              key={item.text + index} // Add index for stable keys, especially with separators
              item={item}
              theme={theme}
              closeMenu={closeMenu}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  menuWrap: {
    zIndex: 10, // Ensure menu is above other elements
    position: 'relative', // Needed for absolute positioning of the dropdown
  },
  menuButton: {
    borderRadius: 5,
    padding: 2, // Add some padding for better touch area
  },
  menu: {
    position: "absolute",
    // top is set dynamically based on iconSize
    right: 0,
    width: 150,
    padding: 5,
    zIndex: 11, // Ensure dropdown is above the button
    borderWidth: 1,
    borderRadius: 5,
    elevation: 3, // Add shadow for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  menuElem: {
    flex: 1,
    marginVertical: 2,
    paddingVertical: 6, // Increased vertical padding
    paddingHorizontal: 8, // Added horizontal padding
    borderRadius: 4,
    // textAlign is not a valid style for View, applied on Text instead
  },
  menuText: {
    fontSize: 16,
    textAlign: "left", // Align text to the left for consistency
  },
  menuLine: {
    height: 1,
    // backgroundColor set dynamically based on theme
    marginVertical: 5,
  },
});
