import { render, screen } from "@testing-library/react"
import App from "../App"
import { BrowserRouter } from "react-router-dom"

describe("App Component", ()=>{
    beforeEach(()=>{
        render(
            <BrowserRouter>
            <App/>
            </BrowserRouter>
        )
    })
    test("Should render register component", ()=>{
         const registerComponent = screen.getByTestId("register");
         expect(registerComponent).toBeInTheDocument();
    })
})