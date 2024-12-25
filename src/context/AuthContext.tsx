// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSupabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useAtom(globalStateAtom);
  const supabase = useSupabase();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          setState((prev) => ({
            ...prev,
            user: session.user,
            customer: {
              id: session.user.id,
              email: session.user.email!,
              firstName: session.user.user_metadata.first_name || "",
              lastName: session.user.user_metadata.last_name || "",
            },
          }));
        }
      } catch (error) {
        console.error("Error checking user session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setState((prev) => ({
          ...prev,
          user: session.user,
          customer: {
            id: session.user.id,
            email: session.user.email!,
            firstName: session.user.user_metadata.first_name || "",
            lastName: session.user.user_metadata.last_name || "",
          },
        }));
      } else {
        setState((prev) => ({
          ...prev,
          user: null,
          customer: null,
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setState]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setState((prev) => ({
        ...prev,
        user: null,
        customer: null,
      }));
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  const value = {
    user: state.user as User | null,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
