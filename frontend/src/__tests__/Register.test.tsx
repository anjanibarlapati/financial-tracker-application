import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Register } from '../components/Register';
import { registerUser } from '../services/user';
import { UserContext } from '../contexts/user';
import { ReactNode, useState } from 'react';
import { IUser } from '../interfaces/user';

jest.mock('../services/user', () => ({
    registerUser: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockSetCurrentUser = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));


const MockUserProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<IUser>({
        username: '',
        password: '',
        income: [],
        totalIncome: 0,
        transactions: [],
        availableBalance: 0,
        budgets: [],
        totalBudget: 0,
        savingsGoals: []
    });

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser: mockSetCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};


describe("Registration Component", () => {

    let user = {
        username: "abc",
        password: "abc",
        transactions: [],
        income: [],
        availableBalance: 0,
        totalIncome: 0,
        budgets: [],
        totalBudget: 0,
        savingsGoals: [],
    };

    beforeEach(() => {
        render(
            <BrowserRouter>
                <MockUserProvider>
                    <Register />
                </MockUserProvider>
            </BrowserRouter>

        );
        jest.clearAllMocks();
    })
    it("Should render fingrow title", () => {
        const appTitle: HTMLElement = screen.getByText(/fingrow/i, { selector: '.app-title' })
        expect(appTitle).toBeInTheDocument();
    })

    it("Should render application logo", () => {
        const appLogo: HTMLImageElement = screen.getByAltText(/logo/i);
        expect(appLogo).toBeInTheDocument();
        expect(appLogo).toHaveAttribute('src', '/assets/app-logo.png');
    })

    it("Should render input element with placeholder enter username", () => {
        const usernameInput: HTMLImageElement = screen.getByPlaceholderText("Enter Username");
        expect(usernameInput).toBeInTheDocument();
    })

    it("Should render password input field", () => {
        const passwordInput: HTMLImageElement = screen.getByPlaceholderText("Enter Password");
        expect(passwordInput).toBeInTheDocument();
    })


    test('Should allow user to enter username and password', () => {
        const usernameInput: HTMLInputElement = screen.getByPlaceholderText(/enter username/i);
        const passwordInput: HTMLInputElement = screen.getByPlaceholderText(/enter password/i);

        fireEvent.change(usernameInput, { target: { value: 'anjani' } });
        fireEvent.change(passwordInput, { target: { value: 'anjani123' } });

        expect(usernameInput.value).toBe('anjani');
        expect(passwordInput.value).toBe('anjani123');
    });

    test('Should register user on clicking register button', async () => {

        const usernameInput = screen.getByPlaceholderText(/enter username/i);
        const passwordInput = screen.getByPlaceholderText(/enter password/i);
        const registerButton = screen.getByText(/register/i);

        fireEvent.change(usernameInput, { target: { value: 'anjani' } });
        fireEvent.change(passwordInput, { target: { value: 'anjani123' } });
        fireEvent.click(registerButton);

        expect(registerButton).toBeInTheDocument();
        expect(registerUser).toHaveBeenCalledWith("anjani", "anjani123");
    });

    test('Should alert user on registration failure', async () => {
        const usernameInput = screen.getByPlaceholderText(/enter username/i);
        const passwordInput = screen.getByPlaceholderText(/enter password/i);
        const registerButton = screen.getByText(/register/i);

        (registerUser as jest.Mock).mockImplementation(() => {
            throw new Error('Registration failed')
        });

        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

        fireEvent.change(usernameInput, { target: { value: 'anjani' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(registerButton);

        expect(alertSpy).toHaveBeenCalledWith('Registering the user failed :(');
        alertSpy.mockRestore();
    });

    it("should display the login prompt", () => {
        const loginPrompt = screen.getByText(/already have an account\?/i);
        expect(loginPrompt).toBeInTheDocument();
    });

    it("should display the login link", () => {
        const loginLink = screen.getByText(/login/i);
        expect(loginLink).toBeInTheDocument();
    });

    test('Should navigate to homepage after successful registration', async () => {
        (registerUser as jest.Mock).mockResolvedValueOnce({});

        const usernameInput = screen.getByPlaceholderText(/enter username/i);
        const passwordInput = screen.getByPlaceholderText(/enter password/i);
        const registerButton = screen.getByText(/register/i);

        fireEvent.change(usernameInput, { target: { value: 'anjani' } });
        fireEvent.change(passwordInput, { target: { value: 'anjani123' } });

        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/homepage");
        });
    });

    it("should navigate to the login page when login link is clicked", () => {
        const loginLink = screen.getByText(/login/i);
        waitFor(() => {
            fireEvent.click(loginLink);

        })
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    test('Should register user and set current user in context on successful registration', async () => {
        (registerUser as jest.Mock).mockResolvedValueOnce(user);

        const usernameInput = screen.getByPlaceholderText(/enter username/i);
        const passwordInput = screen.getByPlaceholderText(/enter password/i);
        const registerButton = screen.getByText(/register/i);

        fireEvent.change(usernameInput, { target: { value: 'anjani' } });
        fireEvent.change(passwordInput, { target: { value: 'anjani123' } });
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(mockSetCurrentUser).toHaveBeenCalledWith(user);
        });
    });

    test('Should not set current user registration failure', async () => {
        const usernameInput = screen.getByPlaceholderText(/enter username/i);
        const passwordInput = screen.getByPlaceholderText(/enter password/i);
        const registerButton = screen.getByText(/register/i);
    
        (registerUser as jest.Mock).mockImplementation(() => {
            throw new Error('Registration failed');
        });
    
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

    
        fireEvent.change(usernameInput, { target: { value: 'anjani' } });
        fireEvent.change(passwordInput, { target: { value: 'anjani123' } });
        fireEvent.click(registerButton);

        expect(mockSetCurrentUser).not.toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalledWith('Registering the user failed :(');
        alertSpy.mockRestore();
    });
    
})