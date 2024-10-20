import { fireEvent, render, screen } from '@testing-library/react';
import { Login } from '../components/Login';
import { loginUser } from '../services/user';

jest.mock('../services/user', () => ({
    loginUser: jest.fn(),
}));

describe("Login Component", () => {

    beforeEach(() => {
        render(<Login />);
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

    test("Should render login button", ()=>{
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
        
        (loginUser as jest.Mock).mockImplementation(()=>{
            throw new Error('Registration failed')
        });
    
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
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
    
})