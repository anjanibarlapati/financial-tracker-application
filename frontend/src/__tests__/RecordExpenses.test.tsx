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
    test('Should render Add Transaction text', () => {
        const transactionText= screen.getByText(/Add Transaction/i);
        expect(transactionText).toBeInTheDocument();
    });

    test('Should render Create Budget image and text', () => {
        const budgetImage:HTMLImageElement = screen.getByAltText("budget");
        const budgetText:HTMLElement= screen.getByText(/create budget/i);
        expect(budgetImage).toHaveAttribute('src', '/assets/budget.png');
        expect(budgetText).toBeInTheDocument();
    });
    test('Should render Create Savings Goal image and text', () => {

        const savingsGoalImage:HTMLImageElement = screen.getByAltText("savings-goals");
        const savingsGoalText:HTMLElement= screen.getByText(/create savings goal/i);
        expect(savingsGoalImage).toHaveAttribute('src', '/assets/savings-goals.png');
        expect(savingsGoalText).toBeInTheDocument();
    });
})

