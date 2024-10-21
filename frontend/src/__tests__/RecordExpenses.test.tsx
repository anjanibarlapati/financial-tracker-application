import { fireEvent, render,screen } from "@testing-library/react";
import { ReactNode } from "react";
import { UserContext } from "../contexts/user";
import { RecordExpenses } from "../components/RecordExpenses";


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

describe("Record Expenses Component", ()=>{
    beforeEach(() => {
        render(
            <MockUserProvider>
                <RecordExpenses />
            </MockUserProvider>
        );
    })

    test("Should render record expenses text", ()=>{
        const recordExpensesText:HTMLElement = screen.getByText(/record expenses/i);
        expect(recordExpensesText).toBeInTheDocument();
    });

})

