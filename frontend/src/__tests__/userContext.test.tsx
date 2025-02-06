import { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserContext, UserProvider } from '../contexts/user';


const TestComponent = () => {
    const { currentUser, setCurrentUser } = useContext(UserContext);

    function updateUser() {
        setCurrentUser({
            username: 'anjani',
            password: 'anjani123',
            income: [],
            totalIncome: 0,
            transactions: [],
            availableBalance: 0,
            budgets: [],
            totalBudget: 0,
            savingsGoals: []
        });
    };

    return (
        <div data-testid="testing component">
            <h1 data-testid="username">{currentUser.username}</h1>
            <h1>{currentUser.password}</h1>
            <h1>{currentUser.totalIncome}</h1>
            <h1>{currentUser.availableBalance}</h1>
            <h1>{currentUser.totalBudget}</h1>

            <button onClick={updateUser}>Update User</button>
        </div>
    );
};

describe('UserContext', () => {
    test('renders with initial state', () => {
        render(
            <UserProvider>
                <TestComponent />
            </UserProvider>
        );

        expect(screen.getByTestId('testing component')).toBeInTheDocument();
        expect(screen.getByTestId('username')).toHaveTextContent('');
    });

    test('updates user state', () => {
        render(
            <UserProvider>
                <TestComponent />
            </UserProvider>
        );

        const button = screen.getByText('Update User');
        fireEvent.click(button);

        expect(screen.getByTestId('username')).toHaveTextContent('anjani');
    });

});
