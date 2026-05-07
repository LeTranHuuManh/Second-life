import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "./mock-data";

// --- Auth Context ---
interface User {
  id: string | number;
  name: string;
  email: string;
  fullName?: string;
  avatar: string;
  role: "USER" | "ADMIN" | "user" | "seller" | string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, token?: string, refreshToken?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check mock storage
    const stored = localStorage.getItem("second_life_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, token?: string, refreshToken?: string) => {
    setUser(userData);
    localStorage.setItem("second_life_user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("second_life_token", token);
    }
    if (refreshToken) {
      localStorage.setItem("second_life_refresh_token", refreshToken);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("second_life_user");
    localStorage.removeItem("second_life_token");
    localStorage.removeItem("second_life_refresh_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// --- Cart Context ---
export interface CartItem {
  id: string;
  product: Product;
  type: "buy" | "rent";
  quantity: number;
  startDate?: Date;
  endDate?: Date;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id" | "addedAt">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, "id" | "addedAt">) => {
    setItems((prev) => [
      ...prev,
      { ...item, id: Math.random().toString(), addedAt: new Date() },
    ]);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount: items.length,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <CartProvider>{children}</CartProvider>
  </AuthProvider>
);
