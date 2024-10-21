import { render, screen } from '@testing-library/react';
import { Homepage } from "../components/Homepage";
import { UserContext } from "../contexts/user";
import { ReactNode } from 'react';


const MockUserProvider = ({ children }: { children: ReactNode }) => {
    const mockCurrentUser = {
        username: 'anjani',
        password: 'anjani123',
        income: [],
        totalIncome: 0,
        transactions: [],
        availableBalance: 0,
        budgets: [],
        totalBudget: 0,
        savingsGoals: []
    };

    return (
        <UserContext.Provider value={{ currentUser: mockCurrentUser, setCurrentUser: () => { } }}>
            {children}
        </UserContext.Provider>
    );
};

describe("Homepage Component", () => {
    beforeEach(() => {
        render(
            <MockUserProvider>
                <Homepage />
            </MockUserProvider>
        );
    })

    test("Should render username", () => {
        const welcomeMessage = screen.getByText(/anjani/i);
        expect(welcomeMessage).toBeInTheDocument();
    });
})