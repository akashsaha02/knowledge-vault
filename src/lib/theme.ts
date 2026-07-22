import type { ThemeConfig } from "antd";
import { theme as antdTheme } from "antd";

export const sky = {
  50: "#f0f9ff",
  100: "#e0f2fe",
  200: "#bae6fd",
  300: "#7dd3fc",
  400: "#38bdf8",
  500: "#0ea5e9",
  600: "#0284c7",
  700: "#0369a1",
} as const;

export function getAppTheme(
  mode: "light" | "dark",
  fontFamily: string,
  fontMono: string,
): ThemeConfig {
  const isLight = mode === "light";

  return {
    algorithm: isLight
      ? antdTheme.defaultAlgorithm
      : antdTheme.darkAlgorithm,
    token: {
      fontFamily,
      fontFamilyCode: fontMono,
      colorPrimary: isLight ? sky[500] : sky[400],
      colorInfo: isLight ? sky[500] : sky[400],
      colorLink: isLight ? sky[600] : sky[300],
      colorLinkHover: isLight ? sky[700] : sky[200],
      borderRadius: 10,
      colorBgLayout: isLight ? "#f8fafc" : "#0f172a",
      colorBgContainer: isLight ? "#ffffff" : "#1e293b",
      colorBgElevated: isLight ? "#ffffff" : "#1e293b",
      colorBorder: isLight ? "#e0f2fe" : "#334155",
      colorBorderSecondary: isLight ? "#f0f9ff" : "#1e293b",
      colorText: isLight ? "#0f172a" : "#f1f5f9",
      colorTextSecondary: isLight ? "#64748b" : "#94a3b8",
    },
    components: {
      Layout: {
        siderBg: isLight ? "#ffffff" : "#1e293b",
        headerBg: isLight ? "#ffffff" : "#1e293b",
        bodyBg: isLight ? "#f8fafc" : "#0f172a",
        triggerBg: isLight ? sky[50] : "#0f172a",
        triggerColor: isLight ? sky[600] : sky[300],
      },
      Menu: {
        itemBg: "transparent",
        itemColor: isLight ? "#475569" : "#cbd5e1",
        itemHoverBg: isLight ? sky[50] : "#334155",
        itemHoverColor: isLight ? sky[600] : sky[300],
        itemSelectedBg: isLight ? sky[100] : "rgba(56, 189, 248, 0.15)",
        itemSelectedColor: isLight ? sky[700] : sky[300],
        itemActiveBg: isLight ? sky[100] : "rgba(56, 189, 248, 0.15)",
        activeBarBorderWidth: 0,
        iconSize: 16,
        itemHeight: 40,
        itemMarginInline: 8,
        itemBorderRadius: 8,
      },
      Button: {
        primaryShadow: isLight
          ? "0 2px 0 rgba(14, 165, 233, 0.15)"
          : "none",
      },
      Card: {
        headerBg: isLight ? "#ffffff" : "#1e293b",
      },
      Input: {
        activeBorderColor: isLight ? sky[400] : sky[400],
        hoverBorderColor: isLight ? sky[300] : sky[500],
      },
      Select: {
        optionSelectedBg: isLight ? sky[100] : "rgba(56, 189, 248, 0.15)",
      },
    },
  };
}
