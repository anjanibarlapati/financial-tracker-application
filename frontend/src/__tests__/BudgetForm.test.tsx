import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BudgetForm } from '../components/BudgetForm';
import { UserContext } from '../contexts/user';
import { addBudget } from '../services/user';

jest.mock('../services/user', () => ({
    addBudget: jest.fn()
}));

describe('BudgetForm Component', () => {
    const mockSetCurrentUser = jest.fn();

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
    beforeEach(() => {
        render(
            <UserContext.Provider value = {{currentUser:mockCurrentUser, setCurrentUser:mockSetCurrentUser}}>
               <BudgetForm />
            </UserContext.Provider>
        );
        jest.clearAllMocks();
    });

    test('renders all input fields and the Add button', () => {
        const categoryInput: HTMLElement = screen.getByPlaceholderText(/category/i);
        const amountInput: HTMLElement = screen.getByPlaceholderText(/amount/i);
        const addButton: HTMLElement = screen.getByRole('button', { name: /create/i });

        expect(categoryInput).toBeInTheDocument();
        expect(amountInput).toBeInTheDocument();
        expect(addButton).toBeInTheDocument();
    });

    test('allows users to enter values in the input fields', () => {
        const categoryInput: HTMLElement = screen.getByPlaceholderText(/category/i);
        const amountInput: HTMLElement = screen.getByPlaceholderText(/amount/i);

        fireEvent.change(categoryInput, { target: { value: 'Food' } });
        fireEvent.change(amountInput, { target: { value: '200' } });

        expect(categoryInput).toHaveValue('Food');
        expect(amountInput).toHaveValue('200');
    });

    test('should display an alert if any field is empty when creating a budget', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        const createButton = screen.getByText(/create/i);

        fireEvent.click(createButton);
        expect(alertMock).toHaveBeenCalledWith("Please fill in all fields.");

        alertMock.mockRestore();
    });

    test('should add a budget and update current user', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        const categoryInput = screen.getByPlaceholderText(/category/i);
        const amountInput = screen.getByPlaceholderText(/amount/i);
        const createButton = screen.getByRole('button', { name: /create/i });

        fireEvent.change(categoryInput, { target: { value: 'Food' } });
        fireEvent.change(amountInput, { target: { value: '200' } });

        const userResponse = { budgets: [{ category: 'Food', amount: 200 }] };
        (addBudget as jest.Mock).mockResolvedValue(userResponse);

        fireEvent.click(createButton);

        expect(addBudget).toHaveBeenCalledWith('Food', 200);
        await waitFor(() => {
            expect(mockSetCurrentUser).toHaveBeenCalledWith(userResponse);
        });
        expect(alertMock).toHaveBeenCalledWith("Budget added successfully");

        alertMock.mockRestore();
    });

    test('should display an alert if unable to add a budget', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        const categoryInput = screen.getByPlaceholderText(/category/i);
        const amountInput = screen.getByPlaceholderText(/amount/i);
        const createButton = screen.getByRole('button', { name: /create/i });

        fireEvent.change(categoryInput, { target: { value: 'Food' } });
        fireEvent.change(amountInput, { target: { value: '200' } });

        (addBudget as jest.Mock).mockRejectedValue(new Error("Unable to add budget"));

        fireEvent.click(createButton);
        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith("Adding budget failed");
        });

        alertMock.mockRestore();
    });
});
