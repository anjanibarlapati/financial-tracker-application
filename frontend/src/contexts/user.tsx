import React, { createContext, ReactNode, useState } from "react";
import { IUser } from '../interfaces/user';

interface IUserContext {
    currentUser: IUser;
    setCurrentUser: (user: IUser) => void;
}
export const UserContext = createContext<IUserContext>({
    currentUser: {
        username: '',
        password: '',
        income: [],
        totalIncome: 0,
        transactions: [],
        availableBalance: 0,
        budgets: [],
        totalBudget: 0,
        savingsGoals: []
    },
    setCurrentUser: () => { },
});

export function UserProvider({ children }: { children: ReactNode }): React.JSX.Element {

    const [currentUser, setCurrentUser] = useState<IUser>({
        username: '',
        password: '',
        income: [],
        totalIncome: 0,
        transactions: [],
        availableBalance: 0,
        budgets: [],
        totalBudget: 0,
        savingsGoals: []
    });

    return (
        <UserContext.Provider value={{currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};
