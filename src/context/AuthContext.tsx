// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSupabase } from "@/lib/supabase";
import { globalStateAtom } from "@/context/atoms";
import { useAtom } from "jotai";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useAtom(globalStateAtom);
  const supabase = useSupabase();

  useEffect(() => {
    const { data: authListener } =
      supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAuthChange = async (event: any, session: any) => {
    if (
      (event === "SIGNED_IN" || event === "INITIAL_SESSION") &&
      session !== null
    ) {
      setState({ ...state, user: session.user, session, isSignInOpen: false });
    } else if (event === "SIGNED_OUT") {
      setState({ ...state, user: null, session: null, isSignInOpen: false });
    } else {
      setState({ ...state, user: null });
    }
  };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
