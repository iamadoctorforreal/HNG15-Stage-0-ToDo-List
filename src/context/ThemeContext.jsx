import React, { createContext, useContext, useState, useEffect } from 'react';
import { sounds } from '../utils/soundEffects';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state ('light' or 'dark')
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('bloom_theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Mode state ('simple' or 'magic')
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bloom_mode') || 'simple';
    }
    return 'simple';
  });

  // Sound state
  const [soundOn, setSoundOn] = useState(() => sounds.enabled);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('bloom_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('bloom_mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    sounds.playClick();
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const switchMode = (newMode) => {
    sounds.playSwipe();
    setMode(newMode);
  };

  const toggleSound = () => {
    const newState = sounds.toggle();
    setSoundOn(newState);
    if (newState) {
      sounds.playClick();
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        mode,
        switchMode,
        soundOn,
        toggleSound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
