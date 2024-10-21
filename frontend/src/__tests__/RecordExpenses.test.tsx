import { fireEvent, render,screen } from "@testing-library/react";
import { RecordExpenses } from "../components/RecordExpenses";

describe("Record Expenses Component", ()=>{
    beforeEach(() => {
        render(
            <RecordExpenses />
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

    test("Should render transaction form on clicking add transaction", ()=>{
        const transactionText= screen.getByText(/add transaction/i);
        fireEvent.click(transactionText);
        const transactionForm = screen.getByPlaceholderText(/transaction type/i);
        expect(transactionForm).toBeInTheDocument();

        expect(screen.queryByTestId('budget-form')).not.toBeInTheDocument();
        expect(screen.queryByTestId('savings-goal-form')).not.toBeInTheDocument();
    })

    test("Should render budget form on clicking create budget", ()=>{
        const budgetText= screen.getByText(/create budget/i);
        fireEvent.click(budgetText);
        const budgetForm = screen.getByTestId('budget-form');
        expect(budgetForm).toBeInTheDocument();

        expect(screen.queryByTestId('transaction-form')).not.toBeInTheDocument();
        expect(screen.queryByTestId('savings-goal-form')).not.toBeInTheDocument();
    })

    test("Should render savings goal form on clicking create savings goal", ()=>{
        const savingsGoalText= screen.getByText(/create savings goal/i);
        fireEvent.click(savingsGoalText);
        const savingsGoalForm = screen.getByTestId('savings-goal-form');
        expect(savingsGoalForm).toBeInTheDocument();

        expect(screen.queryByTestId('transaction-form')).not.toBeInTheDocument();
        expect(screen.queryByTestId('budget-form')).not.toBeInTheDocument();
    })
})

