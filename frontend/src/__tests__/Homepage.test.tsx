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
        const welcomeMessage: HTMLElement = screen.getByText(/anjani/i);
        expect(welcomeMessage).toBeInTheDocument();
    });

    test("Should render title and subtitle", () => {
        const title: HTMLElement = screen.getByText(/finGrow: track, save and thrive/i);
        expect(title).toBeInTheDocument();
    });

    it("Should render application image", () => {
        const appImage: HTMLImageElement = screen.getByAltText(/app-image/i);
        expect(appImage).toBeInTheDocument();
        expect(appImage).toHaveAttribute('src', '/assets/homepage.png');
    })
})