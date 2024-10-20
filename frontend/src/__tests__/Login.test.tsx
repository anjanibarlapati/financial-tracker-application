import { render, screen } from '@testing-library/react';
import { Login } from '../components/Login';

describe("Login Component", () => {

    beforeEach(() => {
        render(<Login />)
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
    })
    
})