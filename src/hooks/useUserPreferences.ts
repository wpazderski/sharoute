import { useContext } from "react";
import { type UserPreferences, UserPreferencesContext } from "@/contexts/UserPreferencesContext";

interface UseUserPreferencesReturnValue {
    userPreferences: UserPreferences;
    setUserPreferences: (userPreferences: UserPreferences | ((prev: UserPreferences) => UserPreferences)) => void;
}

export function useUserPreferences(): UseUserPreferencesReturnValue {
    const { userPreferences, setUserPreferences } = useContext(UserPreferencesContext);
    return { userPreferences, setUserPreferences };
}
