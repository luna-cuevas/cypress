import { useEffect } from "react";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

export function useCustomerSession() {
  const [state, setState] = useAtom(globalStateAtom);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/customer/session");
        const { customer } = await response.json();

        setState((prev) => ({
          ...prev,
          customer: customer,
        }));
      } catch (error) {
        console.error("Error checking customer session:", error);
      }
    };

    // Check session on mount
    checkSession();

    // Set up interval to check session periodically (every 5 minutes)
    const interval = setInterval(checkSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [setState]);

  return {
    customer: state.customer,
    isAuthenticated: !!state.customer,
  };
}
