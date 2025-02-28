// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSupabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

interface OtpResponse {
  success: boolean;
  message?: string;
  error?: string;
  redirectUrl?: string;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendOtp: (
    email: string,
    firstName: string,
    lastName: string
  ) => Promise<OtpResponse>;
  verifyOtpAndSetPassword: (
    email: string,
    otp: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<OtpResponse>;
  sendResetOtp: (email: string) => Promise<OtpResponse>;
  verifyResetOtpAndSetPassword: (
    email: string,
    otp: string,
    password: string
  ) => Promise<OtpResponse>;
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

  const sendOtp = async (
    email: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      const response = await fetch("/api/auth/sendOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      return data;
    } catch (error) {
      console.error("Error sending OTP:", error);
      throw error;
    }
  };

  const verifyOtpAndSetPassword = async (
    email: string,
    otp: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      // First verify the OTP
      const verifyResponse = await fetch("/api/auth/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || "Failed to verify email");
      }

      console.log("verifyData", verifyData);

      // If OTP verification is successful, set the password
      const setPasswordResponse = await fetch("/api/auth/setPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          session: verifyData.session,
          user: verifyData.user,
        }),
      });

      const setPasswordData = await setPasswordResponse.json();

      if (!setPasswordResponse.ok) {
        throw new Error(setPasswordData.error || "Failed to set password");
      }

      // Return the response data
      return setPasswordData;
    } catch (error) {
      console.error("Error verifying OTP or setting password:", error);
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

  // Function to send reset password OTP
  const sendResetOtp = async (email: string): Promise<OtpResponse> => {
    try {
      const response = await fetch("/api/auth/sendResetOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset code");
      }

      return data;
    } catch (error: any) {
      console.error("Error sending reset OTP:", error);
      return {
        success: false,
        error: error.message || "Failed to send reset code",
      };
    }
  };

  // Function to verify reset OTP and set new password
  const verifyResetOtpAndSetPassword = async (
    email: string,
    otp: string,
    password: string
  ): Promise<OtpResponse> => {
    try {
      const response = await fetch("/api/auth/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      return data;
    } catch (error: any) {
      console.error("Error resetting password:", error);
      return {
        success: false,
        error: error.message || "Failed to reset password",
      };
    }
  };

  const value = {
    user: state.user as User | null,
    loading,
    signIn,
    signOut,
    resetPassword,
    sendOtp,
    verifyOtpAndSetPassword,
    sendResetOtp,
    verifyResetOtpAndSetPassword,
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
