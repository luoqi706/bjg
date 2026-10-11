export interface MorandiTheme {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  bg: string;
  text: string;
  textMuted: string;
  border: string;
  tintRgb: string; // for glass and radial gradients
}

export const THEME_PRESETS: MorandiTheme[] = [
  {
    id: 'sage',
    name: '豆青鼠尾草',
    primary: '#5B7360',
    primaryHover: '#4A614F',
    primaryLight: '#EBF1EC',
    bg: '#F3F6F3',
    text: '#2D3A32',
    textMuted: '#6F8873',
    border: '#CBD7CE',
    tintRgb: '142, 169, 147',
  },
  {
    id: 'rose',
    name: '陶土裸粉',
    primary: '#9C6356',
    primaryHover: '#875145',
    primaryLight: '#FAF0ED',
    bg: '#F8F3F1',
    text: '#3D2B26',
    textMuted: '#9B736C',
    border: '#DFCCC6',
    tintRgb: '184, 107, 83',
  },
  {
    id: 'slate',
    name: '雾霾灰蓝',
    primary: '#536D7E',
    primaryHover: '#425A6A',
    primaryLight: '#EDF3F7',
    bg: '#F0F4F6',
    text: '#26343E',
    textMuted: '#6D8291',
    border: '#C5D4DE',
    tintRgb: '91, 121, 142',
  },
  {
    id: 'oat',
    name: '暖灰燕麦',
    primary: '#7A6E5F',
    primaryHover: '#665B4D',
    primaryLight: '#F5F2EB',
    bg: '#F6F4F0',
    text: '#3A332B',
    textMuted: '#8C8071',
    border: '#DDD8CE',
    tintRgb: '145, 133, 118',
  },
  {
    id: 'lilac',
    name: '暮云灰紫',
    primary: '#6F5E74',
    primaryHover: '#5B4B60',
    primaryLight: '#F3EEF5',
    bg: '#F4F1F5',
    text: '#342938',
    textMuted: '#87758C',
    border: '#D8CFDA',
    tintRgb: '140, 118, 148',
  },
  {
    id: 'teal',
    name: '松石冷绿',
    primary: '#486D6B',
    primaryHover: '#385856',
    primaryLight: '#ECF3F2',
    bg: '#F1F5F5',
    text: '#253736',
    textMuted: '#6C8987',
    border: '#C6D7D5',
    tintRgb: '94, 137, 135',
  },
  {
    id: 'monochrome',
    name: '水墨黑白灰',
    primary: '#333333',
    primaryHover: '#1A1A1A',
    primaryLight: '#E8E8E8',
    bg: '#F5F5F5',
    text: '#1F1F1F',
    textMuted: '#6E6E73',
    border: '#CCCCCC',
    tintRgb: '120, 120, 120',
  },
];

export const MORANDI_THEMES = THEME_PRESETS;

const THEME_STORAGE_KEY = 'bjd_app_morandi_theme_id';

export function getStoredThemeId(): string {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'sage';
  } catch {
    return 'sage';
  }
}

export function saveStoredThemeId(themeId: string): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch (e) {
    console.error(e);
  }
}

export const saveStoredTheme = saveStoredThemeId;

export function applyThemeToDOM(theme: MorandiTheme): void {
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-primary-hover', theme.primaryHover);
  root.style.setProperty('--theme-primary-light', theme.primaryLight);
  root.style.setProperty('--theme-bg', theme.bg);
  root.style.setProperty('--theme-text', theme.text);
  root.style.setProperty('--theme-text-muted', theme.textMuted);
  root.style.setProperty('--theme-border', theme.border);
  root.style.setProperty('--theme-tint-rgb', theme.tintRgb);

  // Directly apply to body background & text
  document.body.style.backgroundColor = theme.bg;
  document.body.style.color = theme.text;
}
