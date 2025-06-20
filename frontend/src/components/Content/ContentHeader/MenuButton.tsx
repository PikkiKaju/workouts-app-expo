import React, { useState, useRef, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import { Text } from "components/UI/Themed";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "constants/Colors";

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
        <View
          style={[
            styles.menuLine,
            theme === "light"
              ? { backgroundColor: "#AAA" }
              : { backgroundColor: "#555" },
          ]}
        ></View>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => {
        closeMenu();
        setTimeout(() => {
          item.onPressAction();
        }, menuToggleDuration);
      }}
      // Hover effects are primarily for web
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.menuElem,
        // Apply hover/pressed styles based on theme
        isHovered
          ? theme === "light"
            ? { backgroundColor: "#DDD" }
            : { backgroundColor: "#555" }
          : null,
        pressed
          ? theme === "light"
            ? { backgroundColor: "#CCC" }
            : { backgroundColor: "#666" }
          : null,
      ]}
    >
      <Text theme={theme} style={styles.menuText}>
        {item.text}
      </Text>
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
const menuToggleDuration = 200;

// Main MenuButton component
export default function MenuButton({
  theme,
  menuItems,
  iconSize = defaultIconSize,
}: MenuButtonProps) {
  const [menuToggled, setMenuToggled] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false); // State for button hover
  const menuWrapRef = useRef<View>(null); // Ref for the wrapper view (button + potential direct menu)
  const menuRef = useRef<View>(null); // Ref for the dropdown menu itself (used on web)
  const buttonRef = useRef<View>(null); // Ref specifically for the button (used for native measurement)

  // State to store button layout for native modal positioning
  const [buttonLayout, setButtonLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Effect to handle clicks outside the menu (WEB ONLY)
  useEffect(() => {
    // Only run this effect on the web platform
    if (Platform.OS !== "web" || !menuToggled) {
      return;
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (event.target && menuWrapRef.current && menuRef.current) {
        // Check if the click was outside the button wrapper AND outside the menu dropdown
        if (
          !(menuWrapRef.current as unknown as Node).contains(
            event.target as Node
          ) &&
          !(menuRef.current as unknown as Node).contains(event.target as Node)
        ) {
          closeMenu();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuToggled]); // Rerun effect when menuToggled changes (on web)

  // ------------------------------------------
  function toggleMenu() {
    if (!menuToggled && Platform.OS !== "web") {
      // Measure button position before opening the menu on native
      buttonRef.current?.measureInWindow((x, y, width, height) => {
        setButtonLayout({ x, y, width, height });
        setMenuToggled(true); // Open menu after measurement
      });
    } else {
      // Just toggle for web, or close if already open on native
      setMenuToggled((prev) => !prev);
      if (menuToggled && Platform.OS !== "web") {
        // Reset layout if closing on native
        // setButtonLayout(null);
      }
    }
  }

  function closeMenu() {
    setMenuToggled(false);
    if (Platform.OS !== "web") {
      // setButtonLayout(null); // Reset layout on native
    }
  }

  // Common Menu Content View
  const MenuContent = (
    // Use menuRef only for web's direct rendering check
    <View
      ref={Platform.OS === "web" ? menuRef : null}
      style={[
        styles.menu,
        theme === "light"
          ? styles.menuContentBackground
          : styles.menuContentBackgroundDark,
        theme === "light"
          ? styles.menuContentBorder
          : styles.menuContentBorderDark,
        // Apply dynamic position for Native Modal, or static position for Web
        Platform.OS === "web"
          ? { top: iconSize + 5 } // Static position relative to button for web
          : buttonLayout // Dynamic position for native modal
          ? {
              position: "absolute",
              top: buttonLayout.y + buttonLayout.height + 5, // Below button
              left: buttonLayout.x + buttonLayout.width - 150,
              width: 150,
            }
          : {}, // Empty style if layout not ready
      ]}
    >
      {menuItems.map((item, index) => (
        <MenuRowButton
          key={item.text + index}
          item={item}
          theme={theme}
          closeMenu={closeMenu}
        />
      ))}
    </View>
  );

  return (
    // Use menuWrapRef for web's click outside check
    <View ref={menuWrapRef} style={styles.menuWrap}>
      {/* Use buttonRef for native measurement */}
      <Pressable
        ref={buttonRef}
        onPress={toggleMenu}
        // Hover effects for the main button (primarily for web)
        onHoverIn={() => Platform.OS === "web" && setIsButtonHovered(true)}
        onHoverOut={() => Platform.OS === "web" && setIsButtonHovered(false)}
        style={[
          styles.menuButton,
          // Apply active/toggled style
          menuToggled
            ? theme === "light"
              ? styles.menuButtonActiveLight
              : styles.menuButtonActiveDark
            : null,
          // Apply hover style (only if not active, and on web)
          isButtonHovered && !menuToggled && Platform.OS === "web"
            ? theme === "light"
              ? styles.menuButtonHoverLight
              : styles.menuButtonHoverDark
            : null,
        ]}
      >
        <MaterialCommunityIcons
          name="dots-horizontal"
          size={iconSize}
          color={theme === "light" ? "black" : "white"}
        />
      </Pressable>

      {/* <Modal
        isVisible={menuToggled} // Already checked menuToggled above
        coverScreen={false} // No backdrop for web
        hasBackdrop={false} // No backdrop for web
        onBackButtonPress={closeMenu} // Android back button
        onBackdropPress={closeMenu} // Tap outside to close
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
        animationInTiming={200}
        animationOutTiming={200}
        presentationStyle="overFullScreen" // Full screen modal
      >
        {MenuContent}
      </Modal> */}

      {/* {menuToggled && (
        <View ref={menuRef} style={[
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
      )} */}

      {/* Platform-specific rendering for the menu dropdown */}
      {menuToggled &&
        (Platform.OS === "web" ? (
          MenuContent // Directly render the menu for web
        ) : (
          // Native: Render menu inside a Modal
          <Modal
            isVisible={menuToggled} // Already checked menuToggled above
            onBackButtonPress={closeMenu} // Android back button
            onBackdropPress={closeMenu} // Tap outside to close
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
            animationInTiming={menuToggleDuration}
            animationOutTiming={menuToggleDuration}
            presentationStyle="overFullScreen" // Full screen modal
          >
            {MenuContent}
          </Modal>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menuWrap: {
    zIndex: 20, // Ensure menu is above other elements
    position: "relative",
  },
  menuButton: {
    borderRadius: 5,
    padding: 2,
  },
  // Style for the modal overlay (NATIVE ONLY)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
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
    shadowColor: "#000", // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,

    // Platform-specific positioning styles
    ...(Platform.OS === "web"
      ? {
          position: "absolute", // Position absolutely relative to menuWrap
          right: 0,
          zIndex: 11, // Ensure dropdown is above the button on web
          // top is set dynamically based on iconSize
        }
      : {
          // position: 'absolute' is applied dynamically based on buttonLayout for native modal
        }),
  },
  menuButtonHoverLight: {
    backgroundColor: "#EEE", // Light theme hover
  },
  menuButtonHoverDark: {
    backgroundColor: "#555", // Dark theme hover
  },
  menuButtonActiveLight: {
    backgroundColor: "#CCC", // Light theme active/toggled
  },
  menuButtonActiveDark: {
    backgroundColor: "#444", // Dark theme active/toggled
  },
  menuContentBackground: {
    backgroundColor: "#FBFBFB", // Light theme background
  },
  menuContentBackgroundDark: {
    backgroundColor: "#3a3a3a", // Dark theme background
  },
  menuContentBorder: {
    borderColor: Colors.global.tableLines, // Light theme border
  },
  menuContentBorderDark: {
    borderColor: "#555", // Dark theme border
  },
  menuElem: {
    flex: 1,
    marginVertical: 2,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  menuText: {
    fontSize: 16,
    textAlign: "left", // Align text to the left for consistency
  },
  menuLine: {
    height: 1,
    marginVertical: 5,
  },
});
