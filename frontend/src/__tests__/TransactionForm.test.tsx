import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TransactionForm } from '../components/TransactionForm';
import { addTransaction } from '../services/user';
import { UserContext } from '../contexts/user';

jest.mock('../services/user', () => ({
    addTransaction: jest.fn()
}));

describe('TransactionForm Component', () => {

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
               <TransactionForm />
            </UserContext.Provider>
        );
        jest.clearAllMocks();
    });

    test('renders all input fields and the Add button', () => {
        const typeInput: HTMLElement = screen.getByPlaceholderText(/Transaction type/i);
        const amountInput: HTMLElement = screen.getByPlaceholderText(/Amount/i);
        const categoryInput: HTMLElement = screen.getByPlaceholderText(/Category/i);
        const dateInput: HTMLElement = screen.getByPlaceholderText(/YYYY-MM-DD/i);
        const addButton = screen.getByText(/add/i);

        expect(typeInput).toBeInTheDocument();
        expect(amountInput).toBeInTheDocument();
        expect(categoryInput).toBeInTheDocument();
        expect(dateInput).toBeInTheDocument();
        expect(addButton).toBeInTheDocument();
    });

    test('allows users to enter values in the input fields', () => {
        const typeInput = screen.getByPlaceholderText(/transaction type/i);
        const amountInput: HTMLElement = screen.getByPlaceholderText(/amount/i);
        const categoryInput: HTMLElement = screen.getByPlaceholderText(/Category/i);
        const dateInput: HTMLElement = screen.getByPlaceholderText(/YYYY-MM-DD/i);

        fireEvent.change(typeInput, { target: { value: 'Groceries' } });
        fireEvent.change(amountInput, { target: { value: '50' } });
        fireEvent.change(categoryInput, { target: { value: 'Food' } });
        fireEvent.change(dateInput, { target: { value: '2024-10-21' } });

        expect(typeInput).toHaveValue('Groceries');
        expect(amountInput).toHaveValue('50');
        expect(categoryInput).toHaveValue('Food');
        expect(dateInput).toHaveValue('2024-10-21');
    });

    test('Should display an alert if any field is empty when adding a transaction', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });
        const addButton = screen.getByText(/add/i);

        fireEvent.click(addButton);
        expect(alertMock).toHaveBeenCalledWith("Please fill in all fields.");

        alertMock.mockRestore();
    });

    test('Should display alert if transaction type is invalid', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });
        const typeInput = screen.getByPlaceholderText(/transaction type/i);
        const amountInput = screen.getByPlaceholderText(/amount/i);
        const categoryInput = screen.getByPlaceholderText(/category/i);
        const dateInput = screen.getByPlaceholderText(/yyyy-mm-dd/i);
        const addButton = screen.getByText(/add/i);

        fireEvent.change(typeInput, { target: { value: 'InvalidType' } });
        fireEvent.change(amountInput, { target: { value: '50' } });
        fireEvent.change(categoryInput, { target: { value: 'Food' } });
        fireEvent.change(dateInput, { target: { value: '2024-10-21' } });

        fireEvent.click(addButton);
        expect(alertMock).toHaveBeenCalledWith("Transaction type must be either 'debit' or 'credit'.");

        alertMock.mockRestore();
    });

    test('Should adds a transaction and updates current user', async () => {

        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });
        const typeInput = screen.getByPlaceholderText(/transaction type/i);
        const amountInput = screen.getByPlaceholderText(/amount/i);
        const categoryInput = screen.getByPlaceholderText(/category/i);
        const dateInput = screen.getByPlaceholderText(/yyyy-mm-dd/i);
        const addButton = screen.getByText(/add/i);

        fireEvent.change(typeInput, { target: { value: 'credit' } });
        fireEvent.change(amountInput, { target: { value: '50' } });
        fireEvent.change(categoryInput, { target: { value: 'Food' } });
        fireEvent.change(dateInput, { target: { value: '2024-10-21' } });

        const transaction = {
            id: 1,
            type: 'credit',
            amount: 50,
            category: 'Food',
            date: new Date('2024-10-21'),
        };
        (addTransaction as jest.Mock).mockResolvedValue({...mockCurrentUser, transactions: [transaction] });

        fireEvent.click(addButton);

        expect(addTransaction).toHaveBeenCalledWith(transaction);
        await waitFor(() => {
            expect(mockSetCurrentUser).toHaveBeenCalledWith({...mockCurrentUser, transactions: [transaction] });
        });
        expect(alertMock).toHaveBeenCalledWith("Transaction added successfully");

        alertMock.mockRestore();
    });

    test('shows an alert if unable to add a transaction', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        const typeInput = screen.getByPlaceholderText(/transaction type/i);
        const amountInput = screen.getByPlaceholderText(/amount/i);
        const categoryInput = screen.getByPlaceholderText(/category/i);
        const dateInput = screen.getByPlaceholderText(/yyyy-mm-dd/i);
        const addButton = screen.getByText(/add/i);

        fireEvent.change(typeInput, { target: { value: 'credit' } });
        fireEvent.change(amountInput, { target: { value: '50' } });
        fireEvent.change(categoryInput, { target: { value: 'Food' } });
        fireEvent.change(dateInput, { target: { value: '2024-10-21' } });

        (addTransaction as jest.Mock).mockRejectedValue(new Error("Unable to add transaction"));

        fireEvent.click(addButton);
        await waitFor(()=>{
            expect(alertMock).toHaveBeenCalledWith("Unable to add transaction");

        })
        alertMock.mockRestore();
    });
});

