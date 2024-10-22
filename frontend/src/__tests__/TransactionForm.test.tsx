import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TransactionForm } from '../components/TransactionForm';
import { addTransaction } from '../services/user';
import { UserContext } from '../contexts/user';
import { IUser } from '../interfaces/user';

jest.mock('../services/user', () => ({
    addTransaction: jest.fn()
}));

describe('TransactionForm Component', () => {

    const mockSetCurrentUser = jest.fn();
    let mockCurrentUser:IUser;

    beforeEach(() => {
         mockCurrentUser = {
            username: 'anjani',
            password: 'anjani123',
            income: [],
            totalIncome: 0,
            transactions: [],
            availableBalance: 0,
            budgets: [{ category: 'Home', amount: 100, amountSpent: 80 }],
            totalBudget: 0,
            savingsGoals: [{ title: 'Travel', targetAmount: 100, currentAmountSaved: 85 }]
        };
        render(
            <UserContext.Provider value={{ currentUser: mockCurrentUser, setCurrentUser: mockSetCurrentUser }}>
                <TransactionForm />
            </UserContext.Provider>
        );
        jest.clearAllMocks();
    });

    test('Should render all input fields and the Add button', () => {
        const selectElement = screen.getByRole('combobox');
        const amountInput: HTMLElement = screen.getByPlaceholderText(/Amount/i);
        const categoryInput: HTMLElement = screen.getByPlaceholderText(/Category/i);
        const dateInput: HTMLElement = screen.getByPlaceholderText(/YYYY-MM-DD/i);
        const addButton = screen.getByText(/add/i);

        expect(selectElement).toBeInTheDocument();
        expect(amountInput).toBeInTheDocument();
        expect(categoryInput).toBeInTheDocument();
        expect(dateInput).toBeInTheDocument();
        expect(addButton).toBeInTheDocument();
    });

    test('Should allow users to enter values in the input fields', () => {
        const selectElement = screen.getByRole('combobox');
        const amountInput: HTMLElement = screen.getByPlaceholderText(/amount/i);
        const categoryInput: HTMLElement = screen.getByPlaceholderText(/Category/i);
        const dateInput: HTMLElement = screen.getByPlaceholderText(/YYYY-MM-DD/i);

        fireEvent.change(selectElement, { target: { value: 'credit' } });
        fireEvent.change(amountInput, { target: { value: '50' } });
        fireEvent.change(categoryInput, { target: { value: 'Food' } });
        fireEvent.change(dateInput, { target: { value: '2024-10-21' } });

        expect(selectElement).toHaveValue('credit');
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

    test("Should display an alert if insufficient budget for given category", () => {

        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });

        const selectElement = screen.getByRole('combobox');
        const amountInput = screen.getByPlaceholderText(/amount/i);
        const categoryInput = screen.getByPlaceholderText(/category/i);
        const dateInput = screen.getByPlaceholderText(/yyyy-mm-dd/i);
        const addButton = screen.getByText(/add/i);

        fireEvent.change(selectElement, { target: { value: 'debit' } });
        fireEvent.change(amountInput, { target: { value: '30' } });
        fireEvent.change(categoryInput, { target: { value: 'Home' } });
        fireEvent.change(dateInput, { target: { value: '2024-10-21' } });

        fireEvent.click(addButton);

        expect(alertMock).toHaveBeenCalledWith("Insufficient budget for given category");

        alertMock.mockRestore();
    })

    test('Should adds a transaction and updates current user', async () => {

        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });
        const selectElement = screen.getByRole('combobox');
        const amountInput = screen.getByPlaceholderText(/amount/i);
        const categoryInput = screen.getByPlaceholderText(/category/i);
        const dateInput = screen.getByPlaceholderText(/yyyy-mm-dd/i);
        const addButton = screen.getByText(/add/i);

        fireEvent.change(selectElement, { target: { value: 'credit' } });
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
        (addTransaction as jest.Mock).mockResolvedValue({ ...mockCurrentUser, transactions: [transaction] });

        fireEvent.click(addButton);

        expect(addTransaction).toHaveBeenCalledWith(transaction);
        await waitFor(() => {
            expect(mockSetCurrentUser).toHaveBeenCalledWith({ ...mockCurrentUser, transactions: [transaction] });
        });
        expect(alertMock).toHaveBeenCalledWith("Transaction added successfully");

        alertMock.mockRestore();
    });

    test('Should not display an alert when savings goal progress is above 90%', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });
    
        const selectElement = screen.getByRole('combobox');
        const amountInput = screen.getByPlaceholderText(/amount/i);
        const categoryInput = screen.getByPlaceholderText(/category/i);
        const dateInput = screen.getByPlaceholderText(/yyyy-mm-dd/i);
        const addButton = screen.getByText(/add/i);
    
        fireEvent.change(selectElement, { target: { value: 'credit' } });
        fireEvent.change(amountInput, { target: { value: '5' } }); 
        fireEvent.change(categoryInput, { target: { value: 'Travel' } });
        fireEvent.change(dateInput, { target: { value: '2024-10-21' } });
    
        const transaction = {
            id: 1,
            type: 'credit',
            amount: 5,
            category: 'Travel',
            date: new Date('2024-10-21'),
        };
        (addTransaction as jest.Mock).mockResolvedValue({ ...mockCurrentUser, transactions: [transaction] });
    
        fireEvent.click(addButton);
    
        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith("You have reached 90% of the target amount");
        });
    
        alertMock.mockRestore();
    });

    test('Should not display an alert when savings goal progress is below 90%', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });
    
        const selectElement = screen.getByRole('combobox');
        const amountInput = screen.getByPlaceholderText(/amount/i);
        const categoryInput = screen.getByPlaceholderText(/category/i);
        const dateInput = screen.getByPlaceholderText(/yyyy-mm-dd/i);
        const addButton = screen.getByText(/add/i);
    
        fireEvent.change(selectElement, { target: { value: 'credit' } });
        fireEvent.change(amountInput, { target: { value: '1' } }); 
        fireEvent.change(categoryInput, { target: { value: 'Travel' } });
        fireEvent.change(dateInput, { target: { value: '2024-10-21' } });
    
        const transaction = {
            id: 1,
            type: 'credit',
            amount: 1,
            category: 'Travel',
            date: new Date('2024-10-21'),
        };
        (addTransaction as jest.Mock).mockResolvedValue({ ...mockCurrentUser, transactions: [transaction] });
    
        fireEvent.click(addButton);
    
        await waitFor(() => {
            expect(alertMock).not.toHaveBeenCalledWith("You have reached 100% of the target amount");
        });
    
        alertMock.mockRestore();
    });
    
    

    test('shows an alert if unable to add a transaction', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });
        const selectElement = screen.getByRole('combobox');
        const amountInput = screen.getByPlaceholderText(/amount/i);
        const categoryInput = screen.getByPlaceholderText(/category/i);
        const dateInput = screen.getByPlaceholderText(/yyyy-mm-dd/i);
        const addButton = screen.getByText(/add/i);

        fireEvent.change(selectElement, { target: { value: 'credit' } });
        fireEvent.change(amountInput, { target: { value: '50' } });
        fireEvent.change(categoryInput, { target: { value: 'Food' } });
        fireEvent.change(dateInput, { target: { value: '2024-10-21' } });

        (addTransaction as jest.Mock).mockRejectedValue(new Error("Unable to add transaction"));

        fireEvent.click(addButton);
        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith("Unable to add transaction");

        })
        alertMock.mockRestore();
    });
});

