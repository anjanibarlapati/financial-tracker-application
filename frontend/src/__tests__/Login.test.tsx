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

    
})