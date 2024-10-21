import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionForm } from '../components/TransactionForm';

describe('TransactionForm Component', () => {
    beforeEach(() => {
        render(<TransactionForm />);
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
});
