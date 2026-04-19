'use client';

import { useState, useEffect } from 'react';

interface Settings {
  theme: string;
  arabicFont: string;
  arabicFontSize: string;
  translationFontSize: string;
  language: string;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  arabicFont: 'amiri',
  arabicFontSize: 'large',
  translationFontSize: 'medium',
  language: 'en'
};

const ARABIC_FONT_MAP: Record<string, string> = {
  amiri: '"Amiri", serif',
  naskh: '"Noto Naskh Arabic", serif'
};

const FONT_SIZE_MAP: Record<string, string> = {
  small: '0.95rem',
  medium: '1.1rem',
  large: '1.3rem'
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('quran-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('quran-settings', JSON.stringify(settings));
      document.documentElement.setAttribute('data-theme', settings.theme);
      document.documentElement.style.setProperty(
        '--arabic-font-family',
        ARABIC_FONT_MAP[settings.arabicFont] || ARABIC_FONT_MAP.amiri
      );
      document.documentElement.style.setProperty(
        '--arabic-font-size',
        FONT_SIZE_MAP[settings.arabicFontSize] || FONT_SIZE_MAP.large
      );
      document.documentElement.style.setProperty(
        '--translation-font-size',
        FONT_SIZE_MAP[settings.translationFontSize] || FONT_SIZE_MAP.medium
      );
    }
  }, [settings, isLoaded]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return { settings, updateSettings };
}
