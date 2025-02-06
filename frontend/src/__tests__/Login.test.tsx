import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../components/Login';
import { loginUser } from '../services/user';
import { UserContext } from '../contexts/user';
import { ReactNode, useState } from 'react';
import { IUser } from '../interfaces/user';

jest.mock('../services/user', () => ({
    loginUser: jest.fn(),
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

describe("Login Component", () => {

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
                    <Login />
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
    it("Should render welcome message", () => {
        const welcomeMessage: HTMLElement = screen.getByText(/welcome back to fingrow!!/i);
        expect(welcomeMessage).toBeInTheDocument();
    });

    it("Should render input element with placeholder enter username", () => {
        const usernameInput: HTMLImageElement = screen.getByPlaceholderText("Enter Username");
        expect(usernameInput).toBeInTheDocument();
    });

    it("Should render password input field", () => {
        const passwordInput: HTMLImageElement = screen.getByPlaceholderText("Enter Password");
        expect(passwordInput).toBeInTheDocument();
    });

    test('Should allow user to enter username and password', () => {
        const usernameInput: HTMLInputElement = screen.getByPlaceholderText(/enter username/i);
        const passwordInput: HTMLInputElement = screen.getByPlaceholderText(/enter password/i);

        fireEvent.change(usernameInput, { target: { value: 'anjani' } });
        fireEvent.change(passwordInput, { target: { value: 'anjani123' } });

        expect(usernameInput.value).toBe('anjani');
        expect(passwordInput.value).toBe('anjani123');
    });

    test("Should render login button", () => {
        const loginButton = screen.getByText(/login/i);
        expect(loginButton).toBeInTheDocument();
    });

    test('Should login user on clicking login button', async () => {

        const usernameInput = screen.getByPlaceholderText(/enter username/i);
        const passwordInput = screen.getByPlaceholderText(/enter password/i);
        const loginButton = screen.getByText(/login/i);

        fireEvent.change(usernameInput, { target: { value: 'anjani' } });
        fireEvent.change(passwordInput, { target: { value: 'anjani123' } });
        fireEvent.click(loginButton);

        expect(loginButton).toBeInTheDocument();
        expect(loginUser).toHaveBeenCalledWith("anjani", "anjani123");
    });

    test('Should alert user on login failure', async () => {
        const usernameInput = screen.getByPlaceholderText(/enter username/i);
        const passwordInput = screen.getByPlaceholderText(/enter password/i);
        const loginButton = screen.getByText(/login/i);

        (loginUser as jest.Mock).mockImplementation(() => {
            throw new Error('Registration failed')
        });

        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

        fireEvent.change(usernameInput, { target: { value: 'anjani' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(loginButton);

        expect(alertSpy).toHaveBeenCalledWith('User login failed :(');
        alertSpy.mockRestore();
    });

    it("should display the register prompt", () => {
        const registerPrompt = screen.getByText(/do not have an account??/i);
        expect(registerPrompt).toBeInTheDocument();
    });

    it("should display the login link", () => {
        const registerLink = screen.getByText(/register/i);
        expect(registerLink).toBeInTheDocument();
    });

    test('Should navigate to homepage after successful registration', async () => {
        (loginUser as jest.Mock).mockResolvedValueOnce({});

        const usernameInput = screen.getByPlaceholderText(/enter username/i);
        const passwordInput = screen.getByPlaceholderText(/enter password/i);
        const loginButton = screen.getByText(/login/i);

        fireEvent.change(usernameInput, { target: { value: 'anjani' } });
        fireEvent.change(passwordInput, { target: { value: 'anjani123' } });

        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/homepage");
        });
    });

    it("should navigate to the register page when register link is clicked", () => {
        const registerLink = screen.getByText(/register/i);
        waitFor(() => {
            fireEvent.click(registerLink);

        })
        expect(mockNavigate).toHaveBeenCalledWith("/register");
    });

    test('Should login user and set current user in context on successful login', async () => {
        (loginUser as jest.Mock).mockResolvedValueOnce(user);

        const usernameInput = screen.getByPlaceholderText(/enter username/i);
        const passwordInput = screen.getByPlaceholderText(/enter password/i);
        const loginButton = screen.getByText(/login/i);

        fireEvent.change(usernameInput, { target: { value: 'anjani' } });
        fireEvent.change(passwordInput, { target: { value: 'anjani123' } });
        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(mockSetCurrentUser).toHaveBeenCalledWith(user);
        });
    });


    test('Should not set current user login failure', async () => {
        const usernameInput = screen.getByPlaceholderText(/enter username/i);
        const passwordInput = screen.getByPlaceholderText(/enter password/i);
        const loginButton = screen.getByText(/login/i);
    
        (loginUser as jest.Mock).mockImplementation(() => {
            throw new Error('Login failed');
        });
    
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => { });

    
        fireEvent.change(usernameInput, { target: { value: 'anjani' } });
        fireEvent.change(passwordInput, { target: { value: 'anjani123' } });
        fireEvent.click(loginButton);

        expect(mockSetCurrentUser).not.toHaveBeenCalled();
        expect(alertSpy).toHaveBeenCalledWith('User login failed :(');
        alertSpy.mockRestore();
    });

})