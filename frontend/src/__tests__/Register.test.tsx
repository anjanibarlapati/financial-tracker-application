import { render, screen } from '@testing-library/react';
import { Register } from '../components/Register';

describe("Registration Component", ()=>{

    beforeEach(()=>{
        render(<Register/>)
    })
    it("Should render fingrow title",()=>{
        const appTitle:HTMLElement = screen.getByText(/fingrow/i)
        expect(appTitle).toBeInTheDocument();
    })

    it("Should render application logo",()=>{
        const appLogo: HTMLImageElement = screen.getByAltText("Logo");
        expect(appLogo).toBeInTheDocument();
        expect(appLogo).toHaveAttribute('src', '/assets/app-logo.png');
    })
})