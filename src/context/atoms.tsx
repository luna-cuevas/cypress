import { atom } from "jotai";

type Address = {
  id: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  country: string;
  zip: string;
};

type Customer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  addresses: Address[];
};

type State = {
  isSignInOpen: boolean;
  session: null | string;
  user: null | string;
  customer: Customer | null;
  showMobileMenu: boolean;
  darkMode: boolean;
  firstVisit: boolean;
  cartOpen: boolean;
  cartId: string | null;
  cartItems: any[];
  cartCost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  } | null;
  checkoutUrl: string | null;
  productViewSize: string;
};

// A helper function to work with localStorage and JSON serialization for the entire application state
const atomWithLocalStorage = (key: string, initialValue: any) => {
  const getInitialValue = () => {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      if (item !== null) {
        try {
          return JSON.parse(item);
        } catch {
          console.error("Could not parse the stored value in localStorage.");
        }
      }
    }
    return initialValue;
  };

  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: ((prevState: State) => State) | State) => {
      const nextValue =
        typeof update === "function" ? update(get(baseAtom)) : update;
      set(baseAtom, nextValue);
      localStorage.setItem(key, JSON.stringify(nextValue));
    }
  );

  return derivedAtom;
};

// Define your initial state
const initialState: State = {
  isSignInOpen: false,
  session: null,
  user: null,
  customer: null,
  showMobileMenu: false,
  darkMode: false,
  firstVisit: true,
  cartOpen: false,
  cartId: null,
  cartItems: [],
  cartCost: {
    subtotalAmount: {
      amount: "0",
      currencyCode: "USD",
    },
    totalAmount: {
      amount: "0",
      currencyCode: "USD",
    },
  },
  checkoutUrl: null,
  productViewSize: "small",
};

// Create an atom with local storage persistence for the entire application state
export const globalStateAtom = atomWithLocalStorage(
  "CypressAppState-v2",
  initialState
);
