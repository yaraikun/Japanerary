import { useEffect } from 'react';

export function useBackHandler() {
  useEffect(() => {
    const pushTrap = () => {
      window.history.pushState(null, '', window.location.href);
    };

    pushTrap();

    const handlePopState = () => {
      pushTrap();
    };

    const handleInteraction = () => {
      pushTrap();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('mousedown', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);
}
