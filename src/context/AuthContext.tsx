import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi, ApiError, type AuthUser } from "@/lib/api";

const TOKEN_KEY = "mesho.authToken";
const USER_KEY = "mesho.authUser";

/** Result returned from `signup` so the page can show the dev-only OTP if present. */
export interface SignupResult {
  message: string;
  /** Set only when the backend has DEV_RETURN_OTP=true and SMTP wasn't actually used. */
  devOtp?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  /**
   * Creates an unverified account and triggers an OTP email. Does NOT log the
   * user in — the page should switch to the OTP screen using the returned
   * message. If the backend exposed a dev-only OTP, it's returned too so the
   * UI can show it on screen.
   */
  signup: (name: string, email: string, password: string) => Promise<SignupResult>;
  /** Verify the 6-digit OTP the user received. Logs them in on success. */
  verifyOtp: (email: string, otp: string) => Promise<void>;
  /** Re-fetch the current user from the server and update local state. */
  refresh: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => readUser());
  const [loading, setLoading] = useState<boolean>(() => !!localStorage.getItem(TOKEN_KEY));

  // On mount, if we have a token, refresh user details from the server.
  // If the token is invalid/expired, clear it.
  useEffect(() => {
    let cancelled = false;

    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { user: fresh } = await authApi.me();
        if (cancelled) return;
        setUser(fresh);
        localStorage.setItem(USER_KEY, JSON.stringify(fresh));
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((t: string, u: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(t);
    setUser(u);
  }, []);

  const login = useCallback<AuthContextValue["login"]>(
    async (email, password) => {
      const res = await authApi.login({ email, password });
      persist(res.token, res.user);
    },
    [persist]
  );

  /**
   * Signup creates an UNVERIFIED user. The server emails them a 6-digit OTP.
   * No JWT is issued here — the caller should switch to the OTP screen.
   */
  const signup = useCallback<AuthContextValue["signup"]>(
    async (name, email, password) => {
      const res = await authApi.signup({ name, email, password });
      return { message: res.message, devOtp: res.devOtp };
    },
    []
  );

  const verifyOtp = useCallback<AuthContextValue["verifyOtp"]>(
    async (email, otp) => {
      const res = await authApi.verifyOtp({ email, otp });
      persist(res.token, res.user);
    },
    [persist]
  );

  const refresh = useCallback<AuthContextValue["refresh"]>(async () => {
    try {
      const { user: fresh } = await authApi.me();
      setUser(fresh);
      localStorage.setItem(USER_KEY, JSON.stringify(fresh));
    } catch (err) {
      // If the token has gone bad (expired, revoked) drop it so the UI can
      // bounce the user to /login. Other errors are non-fatal.
      if (err instanceof ApiError && err.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      }
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      login,
      signup,
      verifyOtp,
      refresh,
      logout,
    }),
    [user, token, loading, login, signup, verifyOtp, refresh, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}
