const tintColorLight = '#2f95dc';
const tintColorDark = '#ffffff';
const borderColorLight = "#FF6666";
const borderColorDark = "#FFCC66";

export default {
  global: {
    tabIconDefault: "#ccvvvc",
    tableLines: "#999999",
    themeColorFirst: "#FF6666",
    themeColorSecond: "#FFCC66",
  },
  light: {
    text: '#000000',
    textMuted: '#666666',
    background: '#ffffff',
    backgroundHover: '#efefef',
    backgroundAccessory: "#ffffff",
    border: borderColorLight,
    tint: tintColorLight,
    tabIconSelected: tintColorLight
  },
  dark: {
    text: '#ffffff',
    textMuted: '#aaaaaa',
    background: '#181818',
    backgroundHover: '#282828',
    backgroundAccessory: "#181818",
    border: borderColorDark,
    tint: tintColorDark,
    tabIconSelected: tintColorDark
  },
};
