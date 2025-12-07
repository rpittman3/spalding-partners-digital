import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: 'admin' | 'client' | 'sub_user' | null;
  loading: boolean;
  isRecoveryMode: boolean;
  clearRecoveryMode: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<'admin' | 'client' | 'sub_user' | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState(() => {
    // Check URL hash for recovery type on initial load BEFORE Supabase processes it
    const hash = window.location.hash;
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const type = hashParams.get('type');
      console.log('AuthProvider init - URL hash type:', type, 'full hash:', hash);
      if (type === 'recovery') {
        return true;
      }
    }
    // Also check URL search params (some redirects use query params)
    const searchParams = new URLSearchParams(window.location.search);
    const searchType = searchParams.get('type');
    const recoveryParam = searchParams.get('recovery');
    console.log('AuthProvider init - URL search type:', searchType, 'recovery:', recoveryParam);
    if (searchType === 'recovery' || recoveryParam === 'true') {
      return true;
    }
    return false;
  });
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext onAuthStateChange:', event, 'session AMR:', session?.user?.app_metadata);
        
        // Detect password recovery event
        if (event === 'PASSWORD_RECOVERY') {
          console.log('PASSWORD_RECOVERY event detected in AuthContext');
          setIsRecoveryMode(true);
        }
        
        // Also check if this is a recovery session by looking at AMR
        // Recovery sessions have 'recovery' in their amr claim
        if (event === 'SIGNED_IN' && session?.user) {
          const amr = session.user.app_metadata?.amr;
          console.log('Checking AMR for recovery:', amr);
          if (Array.isArray(amr)) {
            const hasRecovery = amr.some((entry: { method?: string }) => entry.method === 'recovery');
            if (hasRecovery) {
              console.log('Recovery method detected in AMR');
              setIsRecoveryMode(true);
            }
          }
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role - deferred with setTimeout to avoid deadlock
          setTimeout(async () => {
            const { data: roleData, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .order('created_at', { ascending: true })
              .limit(1)
              .maybeSingle();
            
            console.log('AuthContext role fetch:', { userId: session.user.id, role: roleData?.role, error: roleError });
            setRole(roleData?.role ?? null);
          }, 0);
        } else {
          setRole(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle();
          
          console.log('AuthContext init role fetch:', { userId: session.user.id, role: roleData?.role, error: roleError });
          setRole(roleData?.role ?? null);
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const clearRecoveryMode = () => {
    setIsRecoveryMode(false);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, isRecoveryMode, clearRecoveryMode, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
