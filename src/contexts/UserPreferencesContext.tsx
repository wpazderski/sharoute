"use client";

import { useLocalStorage } from "@mantine/hooks";
import { createContext, useMemo } from "react";

export const negativeGradeColoringOptions = ["mirrorPositiveGrade", "negativeGradeGradient", "singleColor"] as const;
export const measurementSystemOptions = ["metric", "imperial"] as const;

export type NegativeGradeColoring = (typeof negativeGradeColoringOptions)[number];
export type MeasurementSystem = (typeof measurementSystemOptions)[number];

export interface UserPreferences {
    negativeGradeColoring: NegativeGradeColoring;
    measurementSystem: MeasurementSystem;
}

export function getDefaultUserPreferences(): UserPreferences {
    return {
        negativeGradeColoring: "mirrorPositiveGrade",
        measurementSystem: "metric",
    };
}

export interface UserPreferencesContextValue {
    userPreferences: UserPreferences;
    setUserPreferences: (userPreferences: UserPreferences | ((prev: UserPreferences) => UserPreferences)) => void;
}

export const UserPreferencesContext = createContext<UserPreferencesContextValue>({
    userPreferences: getDefaultUserPreferences(),
    setUserPreferences: () => {},
});

interface UserPreferencesContextProviderProps extends React.PropsWithChildren {}

export function UserPreferencesContextProvider(props: UserPreferencesContextProviderProps) {
    const [userPreferences, setUserPreferences] = useLocalStorage<UserPreferences>({
        key: "sharoute-user-preferences",
        defaultValue: getDefaultUserPreferences(),
    });

    const value = useMemo(() => ({ userPreferences, setUserPreferences }), [userPreferences, setUserPreferences]);

    return <UserPreferencesContext.Provider value={value}>{props.children}</UserPreferencesContext.Provider>;
}
