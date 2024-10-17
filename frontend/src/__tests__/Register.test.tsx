import { render, screen } from '@testing-library/react';
import { Register } from '../components/Register';

describe("Registartion Component", ()=>{

    beforeAll(()=>{
        render(<Register/>)
    })
    it("Should render fingrow title",()=>{
        const appTitle:HTMLElement = screen.getByText(/fingrow/i)
        expect(appTitle).toBeInTheDocument();

    })
})