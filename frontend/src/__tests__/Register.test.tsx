import { fireEvent, render, screen } from '@testing-library/react';
import { Register } from '../components/Register';


describe("Registration Component", () => {

    beforeEach(() => {
        render(<Register />)
        jest.clearAllMocks();
        console.log = jest.fn();
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
    
})