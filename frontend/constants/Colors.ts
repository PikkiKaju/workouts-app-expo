const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';
const borderColorLight = "#F66";
const borderColorDark = "#FC6";

export default {
  global: {
    tabIconDefault: "#ccc",
    tableLines: "#999",
    themeColorFirst: "#F66",
    themeColorSecond: "#FC6",
  },
  light: {
    text: '#000',
    textMuted: '#666',
    background: '#fff',
    backgroundAccessory: "#fff",
    border: borderColorLight,
    tint: tintColorLight,
    tabIconSelected: tintColorLight
  },
  dark: {
    text: '#fff',
    textMuted: '#aaa',
    background: '#181818',
    backgroundAccessory: "#181818",
    border: borderColorDark,
    tint: tintColorDark,
    tabIconSelected: tintColorDark
  },
};
