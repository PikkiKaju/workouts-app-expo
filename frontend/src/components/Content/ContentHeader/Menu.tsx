import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, Platform, Pressable } from "react-native";
import Modal from "react-native-modal";
import { Text } from "components/ui/Themed";
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
  closeMenu: (onHideCallback?: () => void) => void; // Function to close the menu and execute an optional callback
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
      onPress={() => closeMenu(item.onPressAction)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        styles.menuElem,
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

interface MenuProps {
  isVisible: boolean;
  onClose: (onHideCallback?: () => void) => void; // Function to close the menu and execute an optional callback
  menuItems: MenuItem[];
  theme: "light" | "dark";
  buttonLayout: { x: number; y: number; width: number; height: number } | null;
  iconSize: number;
  menuWrapRef: React.RefObject<View>;
  menuToggleDuration: number;
}

export default function Menu({
  onClose,
  menuItems,
  theme,
  buttonLayout,
  iconSize,
  menuWrapRef,
  menuToggleDuration,
}: Omit<MenuProps, "isVisible">) {
  const menuRef = useRef<View>(null);
  const [modalVisible, setModalVisible] = useState(true);
  const onHideCallbackRef = useRef<(() => void) | null>(null);

  // Function to handle closing the menu and executing any callback
  const handleClose = (callback?: () => void) => {
    if (Platform.OS === "web") {
      onClose(callback);
    } else {
      if (callback) {
        // Store the callback to be executed after the modal closes
        onHideCallbackRef.current = callback;
      }
      setModalVisible(false);
    }
  };

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (event.target && menuWrapRef.current && menuRef.current) {
        if (
          !(menuWrapRef.current as unknown as Node).contains(
            event.target as Node
          ) &&
          !(menuRef.current as unknown as Node).contains(event.target as Node)
        ) {
          handleClose();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClose, menuWrapRef, modalVisible]);

  const MenuContent = (
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
        Platform.OS === "web"
          ? { top: iconSize + 5 }
          : buttonLayout
          ? {
              position: "absolute",
              top: buttonLayout.y + buttonLayout.height + 5,
              left: buttonLayout.x + buttonLayout.width - 150,
              width: 150,
            }
          : {},
      ]}
    >
      {menuItems.map((item, index) => (
        <MenuRowButton
          key={item.text + index}
          item={item}
          theme={theme}
          closeMenu={handleClose}
        />
      ))}
    </View>
  );

  if (!menuItems) {
    return null;
  }

  return Platform.OS === "web" ? (
    MenuContent
  ) : (
    <Modal
      isVisible={modalVisible}
      onBackButtonPress={() => handleClose()}
      onBackdropPress={() => handleClose()}
      onModalHide={() => {
        onClose();
        // Execute the callback if it was set
        if (onHideCallbackRef.current) {
          onHideCallbackRef.current();
          onHideCallbackRef.current = null; // Clear the callback after execution
        }
      }}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      animationInTiming={menuToggleDuration}
      animationOutTiming={menuToggleDuration}
      backdropTransitionInTiming={menuToggleDuration}
      backdropTransitionOutTiming={menuToggleDuration}
      presentationStyle="overFullScreen"
      backdropOpacity={0.2}
    >
      {MenuContent}
    </Modal>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    right: 0,
    width: 150,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    ...(Platform.OS === "web"
      ? {
          position: "absolute",
          right: 0,
        }
      : {}),
  },
  menuContentBackground: {
    backgroundColor: "#FBFBFB",
  },
  menuContentBackgroundDark: {
    backgroundColor: "#3a3a3a",
  },
  menuContentBorder: {
    borderColor: Colors.global.tableLines,
  },
  menuContentBorderDark: {
    borderColor: "#555",
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
    textAlign: "left",
  },
  menuLine: {
    height: 1,
    marginVertical: 5,
  },
});
