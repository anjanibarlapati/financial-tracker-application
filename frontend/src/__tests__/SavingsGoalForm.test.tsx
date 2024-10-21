import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SavingsGoalForm } from '../components/SavingsGoalForm';
import { UserContext } from '../contexts/user';
import { addSavingsGoal } from '../services/user';

jest.mock('../services/user', () => ({
    addSavingsGoal: jest.fn()
}));

describe('SavingsGoalForm Component', () => {
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
               <SavingsGoalForm />
            </UserContext.Provider>
        );
        jest.clearAllMocks();
    });

    test('renders all input fields and the Add button', () => {
        const categoryInput: HTMLElement = screen.getByPlaceholderText(/category/i);
        const amountInput: HTMLElement = screen.getByPlaceholderText(/amount/i);
        const addButton: HTMLElement = screen.getByText(/create/i);

        expect(categoryInput).toBeInTheDocument();
        expect(amountInput).toBeInTheDocument();
        expect(addButton).toBeInTheDocument();
    });

    test('allows users to enter values in the input fields', () => {
        const categoryInput: HTMLElement = screen.getByPlaceholderText(/category/i);
        const amountInput: HTMLElement = screen.getByPlaceholderText(/amount/i);

        fireEvent.change(categoryInput, { target: { value: 'Vacation' } });
        fireEvent.change(amountInput, { target: { value: '1500' } });

        expect(categoryInput).toHaveValue('Vacation');
        expect(amountInput).toHaveValue('1500');
    });

    test('should display an alert if any field is empty when creating a savings goal', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        const createButton = screen.getByText(/create/i);

        fireEvent.click(createButton);
        expect(alertMock).toHaveBeenCalledWith("Please fill in all fields.");

        alertMock.mockRestore();
    });

    test('should add a savings goal and update current user', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        const categoryInput = screen.getByPlaceholderText(/category/i);
        const amountInput = screen.getByPlaceholderText(/amount/i);
        const createButton = screen.getByRole('button', { name: /create/i });

        fireEvent.change(categoryInput, { target: { value: 'Vacation' } });
        fireEvent.change(amountInput, { target: { value: '1500' } });

        const userResponse = { savingsGoals: [{ title: 'Vacation', targetAmount: 1500, currentAmountSaved: 0 }] };
        (addSavingsGoal as jest.Mock).mockResolvedValue(userResponse);

        fireEvent.click(createButton);

        expect(addSavingsGoal).toHaveBeenCalledWith({ title: 'Vacation', targetAmount: 1500, currentAmountSaved: 0 });
        await waitFor(() => {
            expect(mockSetCurrentUser).toHaveBeenCalledWith(userResponse);
        });
        expect(alertMock).toHaveBeenCalledWith("Savings goal added successfully");

        alertMock.mockRestore();
    });

    test('should display an alert if unable to add a savings goal', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        const categoryInput = screen.getByPlaceholderText(/category/i);
        const amountInput = screen.getByPlaceholderText(/amount/i);
        const createButton = screen.getByRole('button', { name: /create/i });

        fireEvent.change(categoryInput, { target: { value: 'Vacation' } });
        fireEvent.change(amountInput, { target: { value: '1500' } });

        (addSavingsGoal as jest.Mock).mockRejectedValue(new Error("Unable to add savings goal"));

        fireEvent.click(createButton);
        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith("Adding savings goal failed");
        });

        alertMock.mockRestore();
    });
});
