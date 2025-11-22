import { useState, useEffect } from "react";
import {jwtDecode }from "jwt-decode"; 
import { User } from "../types/models";

export default function useUserFromToken(storedToken: string) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!storedToken) return;

    try {
      
      const decoded: Omit<User, "password"> = jwtDecode(storedToken);

      // Reconstruction de l'objet User
      setUser({
        ...decoded
      
      });
    } catch (error) {
      console.error("Invalid token", error);
      setUser(null);
    }
  }, [storedToken]);

  return user;
}
