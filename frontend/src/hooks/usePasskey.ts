import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

// A small helper to handle JSON requests
const fetchJSON = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    // Ensure cookies (like JWT token and passkey_challenge) are sent
    credentials: "include", 
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Network response was not ok");
  }
  return res.json();
};

export function useRegisterPasskey() {
  return useMutation({
    mutationFn: async () => {
      // 1. Get registration options from server
      const options = await fetchJSON("/api/passkeys/register/options", { method: "POST" });
      
      // 2. Pass options to browser authenticator (Face ID / Touch ID)
      const attResp = await startRegistration(options);
      
      // 3. Send the registration response back to the server for verification
      const verificationResp = await fetchJSON("/api/passkeys/register/verify", {
        method: "POST",
        body: JSON.stringify(attResp),
      });

      return verificationResp;
    },
  });
}

export function useAuthenticatePasskey() {
  return useMutation({
    mutationFn: async () => {
      // 1. Get authentication options from server
      const options = await fetchJSON("/api/passkeys/authenticate/options", { method: "POST" });
      
      // 2. Pass options to browser authenticator
      const asseResp = await startAuthentication(options);
      
      // 3. Send the authentication response back to the server
      const verificationResp = await fetchJSON("/api/passkeys/authenticate/verify", {
        method: "POST",
        body: JSON.stringify(asseResp),
      });

      return verificationResp;
    },
  });
}

export function usePasskeys() {
  return useQuery({
    queryKey: ["passkeys"],
    queryFn: async () => {
      return fetchJSON("/api/passkeys/list");
    },
  });
}

export function useRemovePasskey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return fetchJSON(`/api/passkeys/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["passkeys"] });
    },
  });
}
