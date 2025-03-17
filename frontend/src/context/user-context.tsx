import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { BASE_URL } from "@/lib/constants";
import { apiRequest } from "@/lib/utils";

type User = {
  id: number;
  username: string;
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest(`${BASE_URL}/api/auth`);

      if (!response.ok) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Error fetching user:", error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
