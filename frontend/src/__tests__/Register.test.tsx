import { fireEvent, render, screen } from '@testing-library/react';
import { Register } from '../components/Register';
import { registerUser } from '../services/user';

jest.mock('../services/user', () => ({
    registerUser: jest.fn(),
}));

describe("Registration Component", () => {

    beforeEach(() => {
        render(<Register />)
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

})