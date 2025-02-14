"use client"; 

import { useState, useEffect, createContext, useContext } from "react";
import useAuth, {type User} from "./userData"; // Import the custom hook

interface UserContextType {
  user: User | null;
}

//inizializzo contesto
const UserContext = createContext<UserContextType | undefined>(undefined);

//componente che rende disponibile i dati del context ai figli
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth(); // recupera i dati dell'utente dal sistema di autenticazione
  const [localUser, setLocalUser] = useState<User | null>(null);

  // Cerca i dati dell'utente nel localStorage al montaggio
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  // Gestisce l'autenticazione e aggiorna il contesto solo quando l'utente effettua il login
  useEffect(() => {
    if ( user !== null) {
      // Se l'utente è autenticato, salva i suoi dati nel localStorage
      localStorage.setItem("user", JSON.stringify(user));
      setLocalUser(user);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user: localUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the user
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
