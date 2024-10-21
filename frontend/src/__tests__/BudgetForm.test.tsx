import { render, screen, fireEvent } from '@testing-library/react';
import { BudgetForm } from '../components/BudgetForm';

describe('BudgetForm Component', () => {
    beforeEach(() => {
        render(<BudgetForm />);
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
});
