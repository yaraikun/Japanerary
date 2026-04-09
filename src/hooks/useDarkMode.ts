import { 
  useState, 
  useEffect 
} from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    
    const saved = localStorage.getItem('theme');
    
    if (saved) {
      return saved === 'dark';
    }
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    const metaTheme = document.querySelector('meta[name="theme-color"]');

    if (isDark) {
      root.classList.add('dark');
      
      localStorage.setItem('theme', 'dark');
      
      if (metaTheme) {
        metaTheme.setAttribute('content', '#0f172a');
      }
    } else {
      root.classList.remove('dark');
      
      localStorage.setItem('theme', 'light');
      
      if (metaTheme) {
        metaTheme.setAttribute('content', '#2c3e50');
      }
    }
  }, [isDark]);

  return { 
    isDark, 
    toggle: () => setIsDark(!isDark) 
  };
}
