import { atom } from "jotai";
import { User } from "@supabase/supabase-js";

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
  addresses?: Address[];
};

type State = {
  isSignInOpen: boolean;
  session: string | null;
  user: User | null;
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
  favorites: any[];
};

type CartItem = {
  lineId: string;
  quantity: number;
  product: {
    id: string;
    handle: string;
    title: string;
    vendor: string;
    images: Array<{
      altText: string;
      src: string;
    }>;
  };
  variant: {
    variantId: string;
    variantTitle: string;
    variantPrice: string;
    variantCurrencyCode: string;
  };
};

// A helper function to work with localStorage and JSON serialization for the entire application state
const atomWithLocalStorage = (key: string, initialValue: any) => {
  const getInitialValue = () => {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      if (item !== null) {
        try {
          const parsedValue = JSON.parse(item);

          // Don't normalize the cartId - we need to keep the query parameters
          // if (
          //   parsedValue &&
          //   parsedValue.cartId &&
          //   parsedValue.cartId.includes("?")
          // ) {
          //   console.log("Normalizing cartId in localStorage");
          //   // We'll keep the key parameter for compatibility but strip others
          //   const keyMatch = parsedValue.cartId.match(/\?key=([^&]+)/);
          //   const baseCartId = parsedValue.cartId.split("?")[0];
          //   parsedValue.cartId = keyMatch
          //     ? `${baseCartId}?key=${keyMatch[1]}`
          //     : baseCartId;
          // }

          return parsedValue;
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
  darkMode: true,
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
  favorites: [],
};

// Create an atom with local storage persistence for the entire application state
export const globalStateAtom = atomWithLocalStorage(
  "CypressAppState-v3",
  initialState
);

export const cartAtom = atom<CartItem[]>([]);

// Create a simple action atom for clearing the cart
export const clearCartAction = atom(null, (_get, set) => {
  set(cartAtom, []);
  set(globalStateAtom, (prev) => ({
    ...prev,
    cartId: null,
    cartItems: [],
    cartCost: null,
    checkoutUrl: null,
  }));
});
