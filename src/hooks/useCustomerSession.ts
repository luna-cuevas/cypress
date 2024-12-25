import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

export function useCustomerSession() {
  const [state, setState] = useAtom(globalStateAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const response = await fetch("/api/customer/session");
        const { customer } = await response.json();
        console.log("customer", customer);

        if (isMounted) {
          setState((prev) => ({
            ...prev,
            customer: customer,
          }));
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking customer session:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Check session on mount
    checkSession();

    // Set up interval to check session periodically (every 5 minutes)
    const interval = setInterval(checkSession, 5 * 60 * 1000);

    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [setState]);

  return {
    customer: state.customer,
    isAuthenticated: !!state.customer,
    isLoading,
  };
}
