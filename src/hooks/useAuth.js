import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return undefined;
    }

    let mounted = true;
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const isRecoveryUrl =
      urlParams.get('password-reset') === '1' ||
      urlParams.get('type') === 'recovery' ||
      hashParams.get('type') === 'recovery';
    const authCode = urlParams.get('code');
    const hashAccessToken = hashParams.get('access_token');
    const hashRefreshToken = hashParams.get('refresh_token');

    if (isRecoveryUrl) {
      setIsPasswordRecovery(true);
    }

    const loadSession = async () => {
      try {
        if (authCode) {
          await supabase.auth.exchangeCodeForSession(authCode);
        } else if (hashAccessToken && hashRefreshToken) {
          await supabase.auth.setSession({
            access_token: hashAccessToken,
            refresh_token: hashRefreshToken,
          });
        }

        const { data } = await supabase.auth.getSession();

        if (!mounted) return;
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSession().catch(() => {
      if (mounted) setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    isConfigured: isSupabaseConfigured,
    loading,
    session,
    user,
    isPasswordRecovery,
    clearPasswordRecovery: () => setIsPasswordRecovery(false),
  };
};
