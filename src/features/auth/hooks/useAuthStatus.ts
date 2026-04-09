import { 
  useState, 
  useEffect 
} from 'react';

import { setSupabaseAdminKey } from '@/lib/supabase';

const APP_ID = 
  (import.meta as any).env.VITE_APP_TITLE?.toLowerCase().replace(/\s+/g, '_') 
  || 'trip';

const AUTH_KEY = 
  `${APP_ID}_auth_role`;

const ADMIN_HASH_KEY = 
  `${APP_ID}_admin_hash`;

export type UserRole = 'viewer' | 'admin' | null;

export function useAuthStatus() {
  const [
    isAuthenticated, 
    setIsAuthenticated
  ] = useState<boolean>(false);
  
  const [
    role, 
    setRole
  ] = useState<UserRole>(null);
  
  const [
    isChecking, 
    setIsChecking
  ] = useState(true);

  useEffect(() => {
    const savedRole = 
      localStorage.getItem(AUTH_KEY) as UserRole;
    
    const savedHash = 
      localStorage.getItem(ADMIN_HASH_KEY);
    
    if (savedRole === 'admin' || savedRole === 'viewer') {
      setRole(savedRole);
      
      setIsAuthenticated(true);
      
      if (savedRole === 'admin' && savedHash) {
        setSupabaseAdminKey(savedHash);
      }
    }
    
    setIsChecking(false);
  }, []);

  const login = (
    assignedRole: UserRole, 
    hash?: string
  ) => {
    if (assignedRole) {
      localStorage.setItem(
        AUTH_KEY, 
        assignedRole
      );
      
      setRole(assignedRole);
      
      setIsAuthenticated(true);
      
      if (assignedRole === 'admin' && hash) {
        localStorage.setItem(
          ADMIN_HASH_KEY, 
          hash
        );
        
        setSupabaseAdminKey(hash);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    
    localStorage.removeItem(ADMIN_HASH_KEY);
    
    setSupabaseAdminKey(null);
    
    setRole(null);
    
    setIsAuthenticated(false);
  };

  return { 
    isAuthenticated, 
    role, 
    isChecking, 
    login, 
    logout 
  };
}
