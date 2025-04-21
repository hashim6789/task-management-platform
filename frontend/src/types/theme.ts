export interface ThemeConfig {
  primary: string;
  accent: string;
  background: string;
}

export interface ThemeOptions {
  admin: ThemeConfig;
  user: ThemeConfig;
}

export type ThemeType = "light" | "dark";
