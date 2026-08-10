import { createContext, useContext, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { navigateTo } from "@/lib/navigation";
import { API_BASE_URL } from "@/lib/api";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  image?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetchUser: () => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refetchUser: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<UserProfile | null>({
    queryKey: ["authMe"],
    queryFn: async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: "include",
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.user || data;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 30, // 30 seconds cache
  });

  const refetchUser = async () => {
    queryClient.invalidateQueries({ queryKey: ["authMe"] });
    queryClient.invalidateQueries({ queryKey: ["me"] });
    const result = await refetch();
    return result.data;
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      queryClient.setQueryData(["authMe"], null);
      queryClient.setQueryData(["me"], null);
      queryClient.clear();
      navigateTo("/login", { replace: true });
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated,
        refetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
