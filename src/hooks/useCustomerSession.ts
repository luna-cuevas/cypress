import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export function useCustomerSession() {
  const [state, setState] = useAtom(globalStateAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;

    const checkSession = async () => {
      try {
        setError(null);
        const response = await fetch("/api/customer/session", {
          headers: {
            "Cache-Control": "no-cache",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { customer } = await response.json();
        console.log("Session check response:", { customer });

        if (isMounted) {
          setState((prev) => ({
            ...prev,
            customer: customer,
          }));
          setIsLoading(false);
          retryCount = 0; // Reset retry count on success
        }
      } catch (error) {
        console.error("Error checking customer session:", error);
        if (isMounted) {
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(
              `Retrying session check (${retryCount}/${MAX_RETRIES})...`
            );
            setTimeout(checkSession, RETRY_DELAY);
          } else {
            setError(
              error instanceof Error ? error.message : "Failed to check session"
            );
            setState((prev) => ({
              ...prev,
              customer: null,
            }));
            setIsLoading(false);
          }
        }
      }
    };

    // Check session on mount
    checkSession();

    // Set up interval to check session periodically (every minute)
    const interval = setInterval(() => {
      retryCount = 0; // Reset retry count for periodic checks
      checkSession();
    }, 60 * 1000);

    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [setState]);

  const redirectToLogin = () => {
    window.location.href = `https://shopify.com/69307498727/account`;
  };

  const logout = () => {
    window.location.href = `https://shopify.com/69307498727/account/logout`;
  };

  return {
    customer: state.customer,
    isAuthenticated: !!state.customer,
    isLoading,
    error,
    redirectToLogin,
    logout,
  };
}
