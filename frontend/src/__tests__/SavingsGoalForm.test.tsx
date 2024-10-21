import { render, screen, fireEvent } from '@testing-library/react';
import { SavingsGoalForm } from '../components/SavingsGoalForm';

describe('SavingsGoalForm Component', () => {
    beforeEach(() => {
        render(<SavingsGoalForm />);
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
});
