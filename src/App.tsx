import { useAuthStatus } from '@/features/auth/hooks/useAuthStatus';
import { PasswordGate } from '@/features/auth/components/PasswordGate';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useBackHandler } from '@/hooks/useBackHandler';
import { ItineraryView } from '@/features/itinerary/components/ItineraryView';

export default function App() {
  const { 
    isAuthenticated, 
    role, 
    isChecking, 
    login, 
    logout 
  } = useAuthStatus();
  const { isDark, toggle: toggleTheme } = useDarkMode();

  useBackHandler();

  if (isChecking) {
    return (
      <div className="min-h-screen bg-dark dark:bg-bg-dark flex 
        items-center justify-center transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-primary/20 
          border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PasswordGate isAuthenticated={isAuthenticated} onSuccess={login}>
      <ItineraryView 
        role={role}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onLogout={logout}
      />
    </PasswordGate>
  );
}
