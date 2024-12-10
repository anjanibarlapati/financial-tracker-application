import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserContext } from '../contexts/user';
import { IUser } from '../interfaces/user';
import { RecentTransactions } from '../components/RecentTransactions';
import { toHaveAttribute } from '@testing-library/jest-dom/matchers';


describe('Recent Transactions Component', () => {
    let mockCurrentUser: IUser
    beforeEach(() => {

        mockCurrentUser = {
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
        jest.clearAllMocks();
    });

    test('Should renders Recent Transactions header and icon', () => {
        render(
            <UserContext.Provider value={{ currentUser: mockCurrentUser, setCurrentUser: () => { } }}>
                <RecentTransactions />
            </UserContext.Provider>
        );

        expect(screen.getByText("Recent Transactions")).toBeInTheDocument();
        expect(screen.getByAltText(/recent-transactions/i)).toBeInTheDocument();
        expect(screen.getByAltText(/recent-transactions/i)).toHaveAttribute('src', '/assets/recent-transactions.png');
    });

    test('Should display the latest 5 transactions', () => {
        mockCurrentUser.transactions =[
                {    id:1, type: 'credit', amount: 10000, category: "Rental Salary", date:new Date("2024-09-05")},
                {    id:2, type: 'debit', amount: 480, category: "Other", date:new Date("2024-09-06")},
                {    id:3, type: 'debit', amount: 350, category: "Travel", date:new Date("2024-09-06")},
                {    id:4, type: 'debit', amount: 123, category: "Other", date:new Date("2024-09-07")},
                {    id:5, type: 'debit', amount: 1300, category: "Groceries", date:new Date("2024-09-07")},
        ]
        render(
            <UserContext.Provider value={{ currentUser: mockCurrentUser, setCurrentUser: () => { } }}>
                <RecentTransactions />
            </UserContext.Provider>
        )
        const transactions = screen.getAllByTestId("transactions");
        expect(transactions).toHaveLength(5); 
    });

    test('correctly displays transaction type, category, and amount', () => {
        mockCurrentUser.transactions = [
            { id: 1, type: 'credit', amount: 10000, category: "Rental Salary", date: new Date("2024-09-05") },
            { id: 2, type: 'debit', amount: 480, category: "Other", date: new Date("2024-09-06") },
            { id: 3, type: 'debit', amount: 350, category: "Travel", date: new Date("2024-09-06") },
            { id: 4, type: 'debit', amount: 123, category: "Other", date: new Date("2024-09-07") },
            { id: 5, type: 'debit', amount: 1300, category: "Groceries", date: new Date("2024-09-07") },
        ]
        render(
            <UserContext.Provider value={{ currentUser: mockCurrentUser, setCurrentUser: () => { } }}>
                <RecentTransactions />
            </UserContext.Provider>
        )
        const transactions = screen.getAllByTestId("transactions");
        expect(transactions[0]).toHaveTextContent('debit');
        expect(transactions[0]).toHaveTextContent('Groceries');
        expect(transactions[0]).toHaveTextContent('1300');

        expect(transactions[1]).toHaveTextContent('debit');
        expect(transactions[1]).toHaveTextContent('Other');
        expect(transactions[1]).toHaveTextContent('123');
    });

    test('Should display no transactions message if there are no transactions', () => {
        render(
            <UserContext.Provider value={{ currentUser: mockCurrentUser, setCurrentUser: () => { } }}>
                <RecentTransactions />
            </UserContext.Provider>
        );
        expect(screen.getByText(/No recent transactions/i)).toBeInTheDocument();
    });

    test('Should apply correct class to transaction amount based on type', () => {
        mockCurrentUser.transactions = [
            { id: 1, type: 'credit', amount: 10000, category: "Rental Salary", date: new Date("2024-09-05") },
            { id: 2, type: 'debit', amount: 480, category: "Other", date: new Date("2024-09-06") },
            { id: 3, type: 'debit', amount: 350, category: "Travel", date: new Date("2024-09-06") },
            { id: 4, type: 'debit', amount: 123, category: "Other", date: new Date("2024-09-07") },
            { id: 5, type: 'debit', amount: 1300, category: "Groceries", date: new Date("2024-09-07") },
        ]
        render(
            <UserContext.Provider value={{ currentUser: mockCurrentUser, setCurrentUser: () => { } }}>
                <RecentTransactions />
            </UserContext.Provider>
        )
        const debitAmount = screen.getByText('123');
        const creditAmount = screen.getByText('10000');

        expect(debitAmount).toHaveClass('debit-amount');
        expect(creditAmount).toHaveClass('credit-amount');
    });

});
